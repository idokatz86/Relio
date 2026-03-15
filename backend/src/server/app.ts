/**
 * Relio HTTP + WebSocket Server
 * 
 * Implements the backend-developer agent mandates:
 * 1. WebSocket Infrastructure — real-time 3-way synchronization
 * 2. Intercept & Hold Logic — catch User A's message, route to orchestrator, await Tier 3
 * 3. Data Stripping — sanitize outgoing payloads before broadcasting to User B
 * 
 * @see .github/agents/backend-developer.agent.md
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { processMessage } from '../pipeline/mediation-pipeline.js';
import type { PipelineResult } from '../types/index.js';

// ── Express App ──────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// REST endpoint for single message processing
app.post('/api/v1/mediate', async (req: express.Request, res: express.Response) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    res.status(400).json({ error: 'userId and message are required' });
    return;
  }

  try {
    const result = await processMessage(userId, message);
    // Data stripping: NEVER return the original Tier 1 message in the response
    const sanitized = stripTier1Data(result, userId);
    res.json(sanitized);
  } catch (err) {
    console.error('[API] Pipeline error:', err);
    res.status(500).json({ error: 'Pipeline processing failed' });
  }
});

// ── HTTP Server ──────────────────────────────────────────────
const server = createServer(app);

// ── WebSocket Server ─────────────────────────────────────────
// Follows backend-developer mandate #1: WebSocket Infrastructure
interface RoomMember {
  ws: WebSocket;
  userId: string;
}

const rooms = new Map<string, Map<string, RoomMember>>();

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url ?? '', `http://${req.headers.host}`);
  const roomId = url.searchParams.get('roomId') ?? uuidv4();
  const userId = url.searchParams.get('userId') ?? uuidv4();

  // Join room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  rooms.get(roomId)!.set(userId, { ws, userId });

  ws.send(JSON.stringify({
    type: 'connected',
    roomId,
    userId,
    timestamp: new Date().toISOString(),
  }));

  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type !== 'message') return;

      const rawMessage = parsed.content;
      if (!rawMessage || typeof rawMessage !== 'string') return;

      // Mandate #2: Intercept & Hold Logic
      // Catch User A's message, hold it, route to orchestrator → pipeline
      ws.send(JSON.stringify({
        type: 'processing',
        timestamp: new Date().toISOString(),
      }));

      const result = await processMessage(userId, rawMessage);

      // Send full result to sender (they see their own Tier 1 in their private journal)
      ws.send(JSON.stringify({
        type: 'pipeline_result',
        data: {
          safetyCheck: result.safetyCheck,
          tier3Output: result.tier3Output,
          profile: result.profile,
          processingTimeMs: result.processingTimeMs,
          agentsInvoked: result.agentsInvoked,
        },
        timestamp: new Date().toISOString(),
      }));

      // Mandate #3: Data Stripping
      // Broadcast ONLY Tier 3 to partner (other room members)
      if (result.tier3Output && !result.safetyCheck.halt) {
        const tier3Broadcast = {
          type: 'tier3_message',
          data: {
            content: result.tier3Output,
            fromUserId: userId, // partner knows WHO sent, but not WHAT they said
            safetyLevel: result.safetyCheck.severity,
            timestamp: new Date().toISOString(),
          },
        };

        const room = rooms.get(roomId);
        if (room) {
          for (const [memberId, member] of room) {
            if (memberId !== userId && member.ws.readyState === WebSocket.OPEN) {
              member.ws.send(JSON.stringify(tier3Broadcast));
            }
          }
        }
      }
    } catch (err) {
      console.error('[WS] Message processing error:', err);
      ws.send(JSON.stringify({ type: 'error', message: 'Processing failed' }));
    }
  });

  ws.on('close', () => {
    const room = rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) rooms.delete(roomId);
    }
  });
});

/**
 * Strip Tier 1 data from pipeline results for external responses.
 * The original raw message is NEVER included in API responses.
 */
function stripTier1Data(result: PipelineResult, senderId: string) {
  return {
    senderId,
    safetyHalt: result.safetyCheck.halt,
    safetySeverity: result.safetyCheck.severity,
    tier3Output: result.tier3Output,
    profile: result.profile ? {
      attachmentStyle: result.profile.attachmentStyle,
      activationState: result.profile.activationState,
    } : null,
    processingTimeMs: result.processingTimeMs,
    agentsInvoked: result.agentsInvoked,
  };
}

// ── Start Server ─────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);

server.listen(PORT, () => {
  console.log(`🟢 Relio API Server running on http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}/ws`);
  console.log(`   REST API:  http://localhost:${PORT}/api/v1/mediate`);
  console.log(`   Health:    http://localhost:${PORT}/health`);
});

export { app, server };
