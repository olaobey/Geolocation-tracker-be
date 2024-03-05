import winston from 'winston';
import config from '../../../config/index';

const { combine, timestamp, printf, colorize } = winston.format;

const logger = winston.createLogger({
  level: config.APP_LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    printf((level) => `[${level.timestamp}] ${level.level}: ${level.message}`),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;