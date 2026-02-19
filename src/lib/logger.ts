type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[LOG_LEVEL];
}

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()} [${context}] ${message}`;
}

function serializeError(err: unknown): string {
  if (err instanceof Error) {
    return JSON.stringify({
      name: err.name,
      message: err.message,
      ...(err.stack && { stack: err.stack.split("\n").slice(0, 5).join("\n") }),
    });
  }
  if (err && typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

function createLogger(context: string) {
  return {
    debug(message: string, data?: unknown) {
      if (!shouldLog("debug")) return;
      const msg = formatMessage("debug", context, message);
      if (data !== undefined) console.debug(msg, serializeError(data));
      else console.debug(msg);
    },
    info(message: string, data?: unknown) {
      if (!shouldLog("info")) return;
      const msg = formatMessage("info", context, message);
      if (data !== undefined) console.info(msg, serializeError(data));
      else console.info(msg);
    },
    warn(message: string, data?: unknown) {
      if (!shouldLog("warn")) return;
      const msg = formatMessage("warn", context, message);
      if (data !== undefined) console.warn(msg, serializeError(data));
      else console.warn(msg);
    },
    error(message: string, err?: unknown) {
      if (!shouldLog("error")) return;
      const msg = formatMessage("error", context, message);
      if (err !== undefined) console.error(msg, serializeError(err));
      else console.error(msg);
    },
  };
}

export const logger = {
  create: createLogger,
};
