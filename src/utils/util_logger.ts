// Define color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground (text) colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
  },

  // Background colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
  },
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LoggerOptions {
  level?: LogLevel;
  timestamp?: boolean;
  displayLevel?: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

const DEFAULT_OPTIONS: LoggerOptions = {
  level: 'info',
  timestamp: true,
  displayLevel: true,
};

class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  private shouldLog(level: LogLevel): boolean {
    const currentLevel = this.options.level || 'info';
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];

    // Add timestamp if enabled
    if (this.options.timestamp) {
      parts.push(`${COLORS.fg.gray}[${new Date().toISOString()}]${COLORS.reset}`);
    }

    // Add level if enabled
    if (this.options.displayLevel) {
      let levelColor = COLORS.reset;
      let levelText = level.toUpperCase();

      switch (level) {
        case 'debug':
          levelColor = COLORS.fg.cyan;
          break;
        case 'info':
          levelColor = COLORS.fg.green;
          break;
        case 'warn':
          levelColor = COLORS.fg.yellow;
          levelText = 'WARN';
          break;
        case 'error':
          levelColor = COLORS.fg.red;
          levelText = 'ERROR';
          break;
        case 'critical':
          levelColor = COLORS.bg.red + COLORS.fg.white;
          levelText = 'CRITICAL';
          break;
      }

      parts.push(`${levelColor}${levelText.padEnd(8)}${COLORS.reset}`);
    }

    // Add the main message
    parts.push(`${COLORS.fg.white}${message}${COLORS.reset}`);

    return parts.join(' ');
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    console.debug(this.formatMessage('debug', message), ...args);
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage('info', message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage('warn', message), ...args);
  }

  error(message: string, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    console.error(this.formatMessage('error', message), ...args);
  }

  critical(message: string, ...args: any[]): void {
    if (!this.shouldLog('critical')) return;
    console.error(this.formatMessage('critical', message), ...args);
  }

  log(message: string, ...args: any[]): void {
    this.info(message, ...args);
  }

  success(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    const formatted = `${COLORS.fg.green}✓ ${message}${COLORS.reset}`;
    console.log(this.formatMessage('info', formatted), ...args);
  }

  // For HTTP request logging
  http(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    const formatted = `${COLORS.fg.magenta}⇢ ${message}${COLORS.reset}`;
    console.log(this.formatMessage('info', formatted), ...args);
  }

  // For simple line breaks
  line(): void {
    console.log('');
  }

  // For divider lines
  divider(char = '-', length = 20): void {
    const line = char.repeat(length);
    console.log(`${COLORS.fg.gray}${line}${COLORS.reset}`);
  }

  // For JSON pretty printing
  json(obj: any, level: LogLevel = 'debug'): void {
    if (!this.shouldLog(level)) return;
    console.log(this.formatMessage(level, ''), JSON.stringify(obj, null, 2));
  }
}

const logger = new Logger();

export { logger, COLORS };