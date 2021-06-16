import { Express } from 'express';
import winston from 'winston';
import 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

//Build Logger
const rotatingLogger = new winston.transports.DailyRotateFile({
    filename: 'logs/exampleapp-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '14d'
});

export const logger = winston.createLogger({
    transports: [
    rotatingLogger
    ],
    exitOnError: false
});

export function setupLogs(app: Express) {

    app.use(expressWinston.logger({
        transports: [
          new winston.transports.Console(),
          rotatingLogger
        ],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        )
    }));
}