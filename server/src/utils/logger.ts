/**
 * Logger utility for server-side logging
 * Different log levels based on environment
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const logger = {
  debug: (message: string, meta?: unknown): void => {
    if (shouldLog("debug")) {
      console.log(formatMessage("debug", message, meta));
    }
  },

  info: (message: string, meta?: unknown): void => {
    if (shouldLog("info")) {
      console.log(formatMessage("info", message, meta));
    }
  },

  warn: (message: string, meta?: unknown): void => {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, meta));
    }
  },

  error: (message: string, meta?: unknown): void => {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, meta));
    }
  },

  // HTTP request logger
  http: (method: string, path: string, statusCode: number, duration: number): void => {
    const level = statusCode >= 400 ? "warn" : "info";
    logger[level](`${method} ${path} ${statusCode} - ${duration}ms`);
  },

  // Database query logger (dev only)
  query: (query: string, params?: unknown[], duration?: number): void => {
    if (process.env.NODE_ENV !== "production") {
      logger.debug(`SQL: ${query.substring(0, 200)}${query.length > 200 ? "..." : ""}`, {
        params: params?.slice(0, 5),
        duration: duration ? `${duration}ms` : undefined,
      });
    }
  },
};

export default logger;
