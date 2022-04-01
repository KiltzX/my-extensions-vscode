"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryOpenDocument = void 0;
const vscode_1 = require("vscode");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('try-open-document');
function tryOpenDocument(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger.info(`opening ${path}`);
            return yield vscode_1.workspace.openTextDocument(path);
        }
        catch (error) {
            logger.error(`\tUnable to open file ${path}: ${error.message}`);
        }
    });
}
exports.tryOpenDocument = tryOpenDocument;
//# sourceMappingURL=try-open-document.js.map