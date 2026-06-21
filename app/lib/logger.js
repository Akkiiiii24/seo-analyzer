const isProd = process.env.NODE_ENV === "production";

function log(level, message, context = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  error: (message, context) => log("error", message, context),
  warn: (message, context) => log("warn", message, context),
  info: (message, context) => {
    if (isProd) return; // Reduce noise in prod
    log("info", message, context);
  },
};
