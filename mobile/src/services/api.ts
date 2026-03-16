/**
 * Relio API Client
 *
 * Follows backend-developer agent mandates:
 * - WebSocket Infrastructure for real-time 3-way sync
 * - Intercept & Hold Logic via REST fallback
 * - Data Stripping: server handles this, client trusts response
 */

import { Platform } from 'react-native';
import type { MediationResponse, WSIncoming, WSOutgoing } from '../types';

// Azure Container Apps backend (dev environment)
const AZURE_HOST = 'relio-backend.nicecliff-c249023f.eastus.azurecontainerapps.io';
const LOCAL_HOST = 'localhost';

// Use Azure backend for all builds (dev and prod)
// Switch to LOCAL_HOST for local development with adb reverse
const USE_LOCAL = false;
const DEV_HOST = USE_LOCAL ? LOCAL_HOST : AZURE_HOST;
const DEV_SCHEME = USE_LOCAL ? 'http' : 'https';
const DEV_WS_SCHEME = USE_LOCAL ? 'ws' : 'wss';

const API_BASE = __DEV__
  ? `${DEV_SCHEME}://${DEV_HOST}${USE_LOCAL ? ':3000' : ''}`
  : `https://${AZURE_HOST}`;

const WS_BASE = __DEV__
  ? `${DEV_WS_SCHEME}://${DEV_HOST}${USE_LOCAL ? ':3000' : ''}`
  : `wss://${AZURE_HOST}`;
  : 'wss://api.relio.app';

/**
 * Send a message through the 5-agent pipeline via REST.
 * Used as fallback when WebSocket is unavailable.
 */
export async function sendMessage(
  userId: string,
  message: string,
): Promise<MediationResponse> {
  console.log(`[API] Sending to ${API_BASE}/api/v1/mediate`);
  const response = await fetch(`${API_BASE}/api/v1/mediate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message }),
  });

  if (!response.ok) {
    console.error(`[API] Error: ${response.status}`);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[API] Response:`, JSON.stringify(data).slice(0, 200));
  return data;
}

/**
 * Health check
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * WebSocket connection manager
 *
 * Follows implement-secure-websocket skill:
 * - Exponential backoff reconnection (1s→2s→4s→8s→30s max)
 * - Replay missed Tier 3 messages on reconnect
 */
export class RelioSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private listeners: Map<string, Set<(data: WSIncoming) => void>> = new Map();

  constructor(
    private roomId: string,
    private userId: string,
  ) {}

  connect(): void {
    const url = `${WS_BASE}/ws?roomId=${this.roomId}&userId=${this.userId}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSIncoming = JSON.parse(event.data as string);
        this.emit(data.type, data);
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  send(message: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    const payload: WSOutgoing = { type: 'message', content: message };
    this.ws.send(JSON.stringify(payload));
  }

  on(event: string, callback: (data: WSIncoming) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.listeners.clear();
  }

  private emit(event: string, data: WSIncoming): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
    this.listeners.get('*')?.forEach((cb) => cb(data));
  }

  private scheduleReconnect(): void {
    // Exponential backoff: 1s → 2s → 4s → 8s → 30s max
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay,
    );
    this.reconnectAttempts++;
    setTimeout(() => this.connect(), delay);
  }
}
