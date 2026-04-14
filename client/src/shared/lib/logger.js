const isDev = import.meta.env.DEV;

const formatScope = (scope) => (scope ? `[${scope}]` : "[app]");

const writeLog = (method, scope, ...args) => {
  if (!isDev && method === "debug") {
    return;
  }

  const consoleMethod = console[method] || console.log;
  consoleMethod(formatScope(scope), ...args);
};

export const createLogger = (scope) => ({
  debug: (...args) => writeLog("debug", scope, ...args),
  info: (...args) => writeLog("info", scope, ...args),
  warn: (...args) => writeLog("warn", scope, ...args),
  error: (...args) => writeLog("error", scope, ...args),
});

export const logger = createLogger("app");
