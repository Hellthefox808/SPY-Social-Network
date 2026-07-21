export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogPayload {
  message: string;
  level?: LogLevel;
  correlationId?: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

class Logger {
  private formatLog(level: LogLevel, message: string, correlationId?: string, context?: Record<string, unknown>, error?: unknown) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      correlationId: correlationId || "global",
      message,
      ...(context ? { context } : {}),
      ...(error instanceof Error ? { error: { message: error.message, stack: error.stack } } : error ? { error } : {}),
    };
    return JSON.stringify(entry);
  }

  debug(message: string, context?: Record<string, unknown>, correlationId?: string) {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatLog("DEBUG", message, correlationId, context));
    }
  }

  info(message: string, context?: Record<string, unknown>, correlationId?: string) {
    console.log(this.formatLog("INFO", message, correlationId, context));
  }

  warn(message: string, context?: Record<string, unknown>, correlationId?: string, error?: unknown) {
    console.warn(this.formatLog("WARN", message, correlationId, context, error));
  }

  error(message: string, context?: Record<string, unknown>, correlationId?: string, error?: unknown) {
    console.error(this.formatLog("ERROR", message, correlationId, context, error));
  }
}

export const logger = new Logger();
