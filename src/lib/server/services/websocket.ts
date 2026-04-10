import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { auth } from '$lib/server/auth';
import { ReportService } from '$lib/server/services/report.service';

// Typing for socket.data
interface SocketData {
  user: typeof auth.$Infer.Session.user;
  location?: { latitude: number; longitude: number };
}

let io: Server<any, any, any, SocketData>;

export function initWebSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      // Better to use $env/dynamic/private or process.env consistently
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // ==================== AUTH MIDDLEWARE ====================
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      // Better Auth: Verify the token by passing it in the Authorization header
      const session = await auth.api.getSession({
        headers: new Headers({
          authorization: `Bearer ${token}`,
        }),
      });

      if (!session || !session.user) {
        return next(new Error('Invalid or expired session'));
      }

      // Attach user to socket data for use in listeners
      socket.data.user = session.user;
      next();
    } catch (error) {
      console.error('Socket Auth error:', error);
      next(new Error('Authentication failed internal server error'));
    }
  });

  // ==================== CONNECTION LOGIC ====================
  io.on('connection', (socket) => {
    // We know user exists here because of the middleware
    const userId = socket.data.user?.id;
    console.log(`📡 WS: User connected [${userId}]`);

    // Handle location updates & room management
    socket.on('update-location', (data: { latitude: number; longitude: number }) => {
      socket.data.location = data;
      
      // Simple grid-based room (1 degree ~111km)
      // Tip: Math.floor can be too large for high-density alerts. 
      // Consider a precision multiplier if needed.
      const roomId = `location:${Math.floor(data.latitude)}:${Math.floor(data.longitude)}`;
      
      // Leave old location rooms if any (Socket.io handles cleanup on disconnect)
      // This ensures they only get alerts for their current grid
      socket.rooms.forEach(room => {
        if (room.startsWith('location:') && room !== roomId) {
          socket.leave(room);
        }
      });

      socket.join(roomId);
    });

    // Fetch initial data for alerts in radius
    socket.on('subscribe-alerts', async (data: { radius: number }) => {
      const loc = socket.data.location;
      if (!loc) return;

      try {
        const nearbyReports = await ReportService.getNearbyReports(
          loc.latitude,
          loc.longitude,
          data.radius
        );
        socket.emit('nearby-reports', nearbyReports);
      } catch (err) {
        console.error('Failed to fetch nearby reports for socket:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WS: User disconnected [${userId}]`);
    });
  });

  return io;
}

/**
 * Broadcasts an alert to all users in a specific geographical grid
 */
export function emitAlertToArea(latitude: number, longitude: number, alert: Record<string, unknown>) {
  if (!io) {
    console.error('⚠️ WS: Attempted to emit alert before initialization');
    return;
  }

  const roomId = `location:${Math.floor(latitude)}:${Math.floor(longitude)}`;
  io.to(roomId).emit('new-alert', alert);
}
