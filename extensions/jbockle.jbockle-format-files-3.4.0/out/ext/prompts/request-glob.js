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
exports.requestGlob = void 0;
const vscode_1 = require("vscode");
const operation_aborted_1 = require("../errors/operation-aborted");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('request-glob');
function requestGlob() {
    return __awaiter(this, void 0, void 0, function* () {
        const maybeGlob = yield vscode_1.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'Enter glob pattern',
            prompt: 'Format Files matching glob pattern - press esc to cancel',
        });
        logger.info(`glob entered: ${maybeGlob}`);
        if (!maybeGlob) {
            throw new operation_aborted_1.OperationAborted('Glob pattern undefined or empty');
        }
        const confirmed = yield confirmBlobInput(maybeGlob);
        if (!confirmed) {
            throw new operation_aborted_1.OperationAborted('User aborted');
        }
        return maybeGlob;
    });
}
exports.requestGlob = requestGlob;
function confirmBlobInput(glob) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode_1.window.showQuickPick(['Yes', 'No'], {
            ignoreFocusOut: true,
            placeHolder: `You entered '${glob}', is that correct?`,
        });
        return result === 'Yes';
    });
}
//# sourceMappingURL=request-glob.js.map