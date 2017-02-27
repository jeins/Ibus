'use strict';

const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const logPath = path.resolve(__dirname) + '/../logs';

let customLevels = {
    levels: {
        history: 0,
        error: 1,
        warn: 2,
        info: 3
    },
    colors: {
        history: 'blue',
        error: 'red',
        warn: 'yellow',
        info: 'green'
    }
};

winston.addColors(customLevels.colors);

module.exports = new (winston.Logger)({
    levels: customLevels.levels,
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logPath, './log'),
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'info'
        }),
        new (winston.transports.File)({
          name: 'info-file',
          filename: path.join(logPath, '/info-file.log'),
          level: 'history'
        }),
        new (winston.transports.Console)({
            colorize: 'true'
        })
    ]
});