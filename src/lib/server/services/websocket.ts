import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { auth } from '$lib/server/auth';
import { ReportService } from '$lib/server/services/report.service';

let io: Server;

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
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    try {
      const session = await auth.api.getSession({
        headers: new Headers({
          authorization: `Bearer ${token}`,
        }),
      });
      
      if (!session || !session.user) {
        return next(new Error('Invalid session'));
      }
      
      socket.data.user = session.user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      next(new Error('Authentication failed'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.id);
    
    // Join user's location-based room
    socket.on('update-location', (data: { latitude: number; longitude: number }) => {
      socket.data.location = data;
      const roomId = `location:${Math.floor(data.latitude)}:${Math.floor(data.longitude)}`;
      socket.join(roomId);
    });
    
    // Subscribe to alerts in radius
    socket.on('subscribe-alerts', async (data: { radius: number }) => {
      if (!socket.data.location) return;
      
      const nearbyReports = await ReportService.getNearbyReports(
        socket.data.location.latitude,
        socket.data.location.longitude,
        data.radius
      );
      
      socket.emit('nearby-reports', nearbyReports);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.id);
    });
  });
  
  return io;
}

export function emitAlertToArea(latitude: number, longitude: number, alert: Record<string, unknown>) {
  if (!io) return;
  
  const roomId = `location:${Math.floor(latitude)}:${Math.floor(longitude)}`;
  io.to(roomId).emit('new-alert', alert);
}