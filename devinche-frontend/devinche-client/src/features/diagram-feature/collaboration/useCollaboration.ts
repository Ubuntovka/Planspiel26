'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RemoteCursor {
  id: string;
  displayName: string;
  color: string;
  x: number;
  y: number;
}

export interface DiagramUpdatePayload {
  nodes: any[];
  edges: any[];
}

function getSocketUrl(): string {
  if (typeof window === 'undefined') return '';
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
  return base || window.location.origin;
}

export function useCollaboration(
  diagramId: string | null | undefined,
  getToken: (() => string | null) | undefined,
  userDisplayName: string,
  onDiagramUpdate?: (payload: DiagramUpdatePayload) => void
) {
  const [cursors, setCursors] = useState<RemoteCursor[]>([]);
  const [connected, setConnected] = useState(false);
  const [myColor, setMyColor] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const sendCursorRef = useRef<(x: number, y: number) => void>(() => {});
   const sendDiagramUpdateRef = useRef<(update: DiagramUpdatePayload) => void>(() => {});

  useEffect(() => {
    if (!diagramId || !getToken) return;
    const token = getToken();
    if (!token) return;

    const url = getSocketUrl();
    if (!url) return;

    const socket = io(url, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { diagramId }, (res: { error?: string; others?: { socketId: string; displayName: string; color: string; userId: string }[]; color?: string }) => {
        if (res?.error) {
          console.warn('Collaboration join error:', res.error);
          return;
        }
        setMyColor(res?.color ?? null);
        const others = (res?.others ?? []).map((o) => ({
          id: o.socketId,
          displayName: o.displayName,
          color: o.color,
          x: 0,
          y: 0,
        }));
        setCursors(others);
      });
    });

    socket.on('user_joined', (payload: { socketId: string; userId: string; displayName: string; color: string }) => {
      setCursors((prev) => {
        if (prev.some((c) => c.id === payload.socketId)) return prev;
        return [...prev, { id: payload.socketId, displayName: payload.displayName, color: payload.color, x: 0, y: 0 }];
      });
    });

    socket.on('user_left', (payload: { socketId: string }) => {
      setCursors((prev) => prev.filter((c) => c.id !== payload.socketId));
    });

    socket.on('cursor', (payload: { socketId: string; displayName: string; color: string; x: number; y: number }) => {
      setCursors((prev) =>
        prev.map((c) =>
          c.id === payload.socketId ? { ...c, x: payload.x, y: payload.y, displayName: payload.displayName, color: payload.color } : c
        )
      );
    });

    socket.on('diagram_update', (payload: { nodes?: any[]; edges?: any[] }) => {
      if (!payload) return;
      const nodes = Array.isArray(payload.nodes) ? payload.nodes : [];
      const edges = Array.isArray(payload.edges) ? payload.edges : [];
      onDiagramUpdate?.({ nodes, edges });
    });

    socket.on('disconnect', () => setConnected(false));

    const throttleMs = 80;
    let last = 0;
    sendCursorRef.current = (x: number, y: number) => {
      const now = Date.now();
      if (now - last < throttleMs) return;
      last = now;
      socket.emit('cursor', { x, y });
    };

    sendDiagramUpdateRef.current = (update: DiagramUpdatePayload) => {
      socket.emit('diagram_update', update);
    };

    return () => {
      socket.off('connect');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('cursor');
      socket.off('diagram_update');
      socket.off('disconnect');
      socket.disconnect();
      socketRef.current = null;
      setCursors([]);
      setConnected(false);
      setMyColor(null);
    };
  }, [diagramId, getToken, userDisplayName]);

  const sendCursor = useCallback((x: number, y: number) => {
    sendCursorRef.current(x, y);
  }, []);

  const sendDiagramUpdate = useCallback((update: DiagramUpdatePayload) => {
    sendDiagramUpdateRef.current(update);
  }, []);

  return { cursors, connected, sendCursor, myColor, sendDiagramUpdate };
}
