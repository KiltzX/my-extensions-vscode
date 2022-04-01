"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const vscode_1 = require("vscode");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 0] = "debug";
    LogLevel[LogLevel["info"] = 1] = "info";
    LogLevel[LogLevel["warn"] = 2] = "warn";
    LogLevel[LogLevel["error"] = 3] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
class Logger {
    constructor(source) {
        this.source = source;
    }
    debug(message) {
        Logger.callLog(LogLevel.debug, this.source, message);
    }
    info(message) {
        Logger.callLog(LogLevel.info, this.source, message);
    }
    warn(message) {
        Logger.callLog(LogLevel.warn, this.source, message);
    }
    error(errorOrMessage) {
        let message = errorOrMessage.toString();
        if (errorOrMessage instanceof Error) {
            message = `${errorOrMessage}::${errorOrMessage.message}`;
        }
        Logger.callLog(LogLevel.error, this.source, message);
    }
    static callLog(level, source, message) {
        if (level >= this.logLevel) {
            this.outputChannel.appendLine(`[${this.getTimestamp()} ${LogLevel[level].padEnd(5, '.')}] (${source}) ${message}`);
        }
    }
    static getTimestamp() {
        return new Date().toTimeString().split(' ')[0];
    }
}
exports.Logger = Logger;
Logger.outputChannel = vscode_1.window.createOutputChannel('Format Files');
Logger.logLevel = LogLevel.info;
//# sourceMappingURL=logger.js.map