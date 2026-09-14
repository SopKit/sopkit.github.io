/**
 * @file sopkit-backend/src/telemetry/logger.ts
 * @description Structured JSON logger for edge observability.
 */

export class Logger {
  public static info(message: string, meta?: Record<string, unknown>) {
    console.log(JSON.stringify({ level: "info", message, ...meta, timestamp: new Date().toISOString() }));
  }

  public static warn(message: string, meta?: Record<string, unknown>) {
    console.warn(JSON.stringify({ level: "warn", message, ...meta, timestamp: new Date().toISOString() }));
  }

  public static error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    console.error(JSON.stringify({
      level: "error",
      message,
      error: error instanceof Error ? error.stack : String(error),
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  }
}
