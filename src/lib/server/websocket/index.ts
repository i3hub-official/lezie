import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { auth } from '$lib/server/auth';
import { ReportService } from '$lib/server/services/report.service';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

let io: Server;

export function initWebSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      // Get session from better-auth
      const session = await auth.api.getSession({
        headers: new Headers({
          authorization: `Bearer ${token}`,
        }),
      });

      if (!session || !session.user) {
        return next(new Error('Invalid session'));
      }

      socket.data.user = session.user;
      socket.data.session = session.session;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.id);

    // Update user location
    socket.on('update-location', async (data: { latitude: number; longitude: number; accuracy?: number }) => {
      socket.data.location = { latitude: data.latitude, longitude: data.longitude };
      
      // Update in database
      await db.update(userProfiles)
        .set({
          location: {
            type: 'Point',
            coordinates: [data.longitude, data.latitude],
          },
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, socket.data.user.id));

      // Join location-based room for real-time alerts
      const roomId = `location:${Math.floor(data.latitude)}:${Math.floor(data.longitude)}`;
      socket.join(roomId);
      
      // Load nearby incidents
      const nearbyReports = await ReportService.getNearbyReports(
        data.latitude,
        data.longitude,
        5000, // 5km radius
        20
      );
      
      socket.emit('nearby-incidents', nearbyReports);
    });

    // Subscribe to alerts within radius
    socket.on('subscribe-alerts', async (data: { radius: number }) => {
      if (!socket.data.location) return;

      const alerts = await ReportService.getNearbyReports(
        socket.data.location.latitude,
        socket.data.location.longitude,
        data.radius,
        50
      );
      
      socket.emit('initial-alerts', alerts);
    });

    // Get heatmap data
    socket.on('get-heatmap', async (data: { bounds: Bounds; startDate?: Date; endDate?: Date }) => {
      const heatmap = await ReportService.getReportHeatmap(
        data.bounds,
        data.startDate,
        data.endDate
      );
      socket.emit('heatmap-data', heatmap);
    });

    // Get clusters for current view
    socket.on('get-clusters', async (data: { lat: number; lng: number; zoom: number }) => {
      const clusters = await ReportService.getIncidentClusters(
        data.lat,
        data.lng,
        data.zoom
      );
      socket.emit('cluster-data', clusters);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.id);
    });
  });

  return io;
}

// Helper to emit alerts to area
export function emitAlertToArea(latitude: number, longitude: number, alert: Record<string, unknown>) {
  if (!io) return;
  
  const roomId = `location:${Math.floor(latitude)}:${Math.floor(longitude)}`;
  io.to(roomId).emit('new-alert', alert);
}

// Broadcast to all connected clients
export function broadcastToAll(event: string, data: Record<string, unknown>) {
  if (!io) return;
  io.emit(event, data);
}