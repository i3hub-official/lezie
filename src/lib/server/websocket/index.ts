// src/lib/server/websocket/index.ts

import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { auth } from '$lib/server/auth';
import { ReportService } from '$lib/server/services/report.service';
import { db } from '$lib/server/db';
import { userProfiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

interface Bounds {
  north: number; south: number; east: number; west: number;
}

// Define the shape of your socket data
interface SocketData {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
  location?: { latitude: number; longitude: number };
  lastDbUpdate?: number;
}

let io: Server<any, any, any, SocketData>;

export function initWebSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const session = await auth.api.getSession({
        headers: new Headers({ authorization: `Bearer ${token}` }),
      });

      if (!session) return next(new Error('Invalid session'));

      socket.data.user = session.user;
      socket.data.session = session.session;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`📡 User connected: ${socket.data.user?.id}`);

    socket.on('update-location', async (data: { latitude: number; longitude: number; accuracy?: number }) => {
      const now = Date.now();
      const oldLocation = socket.data.location;
      socket.data.location = { latitude: data.latitude, longitude: data.longitude };

      // 1. Throttle Database Updates (Only update DB once every 30 seconds)
      if (!socket.data.lastDbUpdate || now - socket.data.lastDbUpdate > 30000) {
        await db.update(userProfiles)
          .set({
            location: { type: 'Point', coordinates: [data.longitude, data.latitude] },
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, socket.data.user!.id));
        
        socket.data.lastDbUpdate = now;
      }

      // 2. Manage Room Switching
      const newRoomId = `location:${Math.floor(data.latitude)}:${Math.floor(data.longitude)}`;
      const oldRoomId = oldLocation ? `location:${Math.floor(oldLocation.latitude)}:${Math.floor(oldLocation.longitude)}` : null;

      if (newRoomId !== oldRoomId) {
        if (oldRoomId) socket.leave(oldRoomId);
        socket.join(newRoomId);
        
        // 3. Only fetch reports if they've entered a NEW grid area or it's their first time
        const nearbyReports = await ReportService.getNearbyReports(
          data.latitude, data.longitude, 5000, 20
        );
        socket.emit('nearby-incidents', nearbyReports);
      }
    });

    socket.on('get-heatmap', async (data: { bounds: Bounds; startDate?: Date; endDate?: Date }) => {
      const heatmap = await ReportService.getReportHeatmap(data.bounds, data.startDate, data.endDate);
      socket.emit('heatmap-data', heatmap);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.data.user?.id}`);
    });
  });

  return io;
}

export function emitAlertToArea(latitude: number, longitude: number, alert: Record<string, unknown>) {
  if (!io) return;
  const roomId = `location:${Math.floor(latitude)}:${Math.floor(longitude)}`;
  io.to(roomId).emit('new-alert', alert);
}

export function broadcastToAll(event: string, data: Record<string, unknown>) {
  if (io) io.emit(event, data);
}
