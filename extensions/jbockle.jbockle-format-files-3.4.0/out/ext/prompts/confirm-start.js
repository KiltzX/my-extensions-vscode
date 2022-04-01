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
exports.confirmStart = void 0;
const vscode_1 = require("vscode");
const operation_aborted_1 = require("../errors/operation-aborted");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('confirm-start');
function confirmStart(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode_1.window.showQuickPick([`Do it!`, `Nevermind`], {
            ignoreFocusOut: true,
            placeHolder: `${prompt} (check 'Format Files' output for list of files)`,
        });
        logger.info(`result: ${result}`);
        if (!result || result === 'Nevermind') {
            throw new operation_aborted_1.OperationAborted(result);
        }
    });
}
exports.confirmStart = confirmStart;
//# sourceMappingURL=confirm-start.js.map