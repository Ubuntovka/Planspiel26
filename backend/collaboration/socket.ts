import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config/config';
import { hasDiagramAccess } from '../api/controllers/diagramController';

const DIAGRAM_ROOM_PREFIX = 'diagram:';

interface AuthPayload {
  _id: string;
}

interface Collaborator {
  socketId: string;
  userId: string;
  displayName: string;
  color: string;
}

const COLORS = [
  '#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1',
  '#20c997', '#e83e8c', '#ffc107', '#17a2b8',
];

function pickColor(used: Set<string>): string {
  for (const c of COLORS) {
    if (!used.has(c)) return c;
  }
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function attachCollaborationSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    path: '/socket.io',
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthPayload;
      const user = await User.findById(decoded._id).select('_id firstName lastName email').lean();
      if (!user) return next(new Error('User not found'));
      (socket as any).user = {
        _id: user._id.toString(),
        displayName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Anonymous',
      };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as { _id: string; displayName: string };
    let currentDiagramId: string | null = null;

    socket.on('join', async (payload: { diagramId: string }, cb) => {
      const diagramId = payload?.diagramId;
      if (!diagramId || typeof diagramId !== 'string') {
        cb?.({ error: 'diagramId required' });
        return;
      }
      try {
        const allowed = await hasDiagramAccess(diagramId, user._id);
        if (!allowed) {
          cb?.({ error: 'Access denied' });
          return;
        }
        if (currentDiagramId) {
          socket.leave(DIAGRAM_ROOM_PREFIX + currentDiagramId);
          socket.to(DIAGRAM_ROOM_PREFIX + currentDiagramId).emit('user_left', { socketId: socket.id, userId: user._id });
        }
        const room = DIAGRAM_ROOM_PREFIX + diagramId;
        const roomSockets = await io.in(room).fetchSockets();
        const usedColors = new Set(roomSockets.map((s) => (s as any).color).filter(Boolean));
        const color = pickColor(usedColors);
        (socket as any).color = color;
        (socket as any).diagramId = diagramId;
        currentDiagramId = diagramId;
        socket.join(room);

        const collaborator: Collaborator = {
          socketId: socket.id,
          userId: user._id,
          displayName: user.displayName,
          color,
        };
        socket.to(room).emit('user_joined', collaborator);
        const others: Collaborator[] = roomSockets.map((s) => ({
          socketId: s.id,
          userId: (s as any).user?._id ?? '',
          displayName: (s as any).user?.displayName ?? 'Unknown',
          color: (s as any).color ?? '#6c757d',
        }));
        cb?.({ ok: true, others, color });
      } catch (e) {
        cb?.({ error: e instanceof Error ? e.message : 'Failed to join' });
      }
    });

    socket.on('cursor', (payload: { x: number; y: number }) => {
      if (!currentDiagramId || typeof payload?.x !== 'number' || typeof payload?.y !== 'number') return;
      const room = DIAGRAM_ROOM_PREFIX + currentDiagramId;
      socket.to(room).emit('cursor', {
        socketId: socket.id,
        userId: user._id,
        displayName: user.displayName,
        color: (socket as any).color ?? '#6c757d',
        x: payload.x,
        y: payload.y,
      });
    });

    socket.on('diagram_update', (payload: { nodes?: any[]; edges?: any[] }) => {
      if (!currentDiagramId) return;
      const room = DIAGRAM_ROOM_PREFIX + currentDiagramId;
      const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
      const edges = Array.isArray(payload?.edges) ? payload.edges : [];
      socket.to(room).emit('diagram_update', { nodes, edges });
    });

    socket.on('disconnect', () => {
      if (currentDiagramId) {
        socket.to(DIAGRAM_ROOM_PREFIX + currentDiagramId).emit('user_left', {
          socketId: socket.id,
          userId: user._id,
        });
      }
    });
  });

  return io;
}
