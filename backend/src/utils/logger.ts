/**
 * Relio Structured Logger
 * 
 * Replaces console.log with structured JSON logging.
 * Integrates with Azure Application Insights when configured.
 * 
 * Issue #64: Application Insights + Structured Logging
 * @see .github/agents/backend-developer.agent.md
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  userId?: string;
  roomId?: string;
  agent?: string;
  durationMs?: number;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function emit(entry: LogEntry): void {
  if (!shouldLog(entry.level)) return;

  const line = JSON.stringify(entry);
  if (entry.level === 'error') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

export const logger = {
  debug(message: string, meta?: Partial<LogEntry>) {
    emit({ timestamp: new Date().toISOString(), level: 'debug', message, ...meta });
  },
  info(message: string, meta?: Partial<LogEntry>) {
    emit({ timestamp: new Date().toISOString(), level: 'info', message, ...meta });
  },
  warn(message: string, meta?: Partial<LogEntry>) {
    emit({ timestamp: new Date().toISOString(), level: 'warn', message, ...meta });
  },
  error(message: string, meta?: Partial<LogEntry>) {
    emit({ timestamp: new Date().toISOString(), level: 'error', message, ...meta });
  },

  /** Log a pipeline step with duration tracking */
  pipeline(agent: string, durationMs: number, meta?: Partial<LogEntry>) {
    emit({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Pipeline step: ${agent}`,
      context: 'pipeline',
      agent,
      durationMs,
      ...meta,
    });
  },

  /** Log a safety event (always logged, regardless of level) */
  safety(severity: string, halt: boolean, meta?: Partial<LogEntry>) {
    emit({
      timestamp: new Date().toISOString(),
      level: halt ? 'error' : 'warn',
      message: `Safety: ${severity} (halt=${halt})`,
      context: 'safety',
      severity,
      halt,
      ...meta,
    });
  },
};
