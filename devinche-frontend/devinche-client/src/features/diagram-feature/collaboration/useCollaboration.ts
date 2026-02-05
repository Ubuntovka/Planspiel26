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

function getSocketUrl(): string {
  if (typeof window === 'undefined') return '';
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
  return base || window.location.origin;
}

export function useCollaboration(
  diagramId: string | null | undefined,
  getToken: (() => string | null) | undefined,
  userDisplayName: string
) {
  const [cursors, setCursors] = useState<RemoteCursor[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const sendCursorRef = useRef<(x: number, y: number) => void>(() => {});

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

    socket.on('disconnect', () => setConnected(false));

    const throttleMs = 80;
    let last = 0;
    sendCursorRef.current = (x: number, y: number) => {
      const now = Date.now();
      if (now - last < throttleMs) return;
      last = now;
      socket.emit('cursor', { x, y });
    };

    return () => {
      socket.off('connect');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('cursor');
      socket.off('disconnect');
      socket.disconnect();
      socketRef.current = null;
      setCursors([]);
      setConnected(false);
    };
  }, [diagramId, getToken, userDisplayName]);

  const sendCursor = useCallback((x: number, y: number) => {
    sendCursorRef.current(x, y);
  }, []);

  return { cursors, connected, sendCursor };
}
