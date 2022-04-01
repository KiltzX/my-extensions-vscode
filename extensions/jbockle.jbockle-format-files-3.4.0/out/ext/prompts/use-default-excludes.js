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
exports.useDefaultExcludes = void 0;
const vscode_1 = require("vscode");
const operation_aborted_1 = require("../errors/operation-aborted");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('workspace-validator');
function useDefaultExcludes() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode_1.window.showQuickPick([
            `Yes - Use 'formatFiles' settings in vscode`,
            `No - Don't use excludes`,
        ], { placeHolder: 'Use default excludes?', ignoreFocusOut: true });
        logger.info(`Use default excludes?: ${result}`);
        if (!result) {
            throw new operation_aborted_1.OperationAborted('Selection was canceled');
        }
        return result.startsWith('Yes');
    });
}
exports.useDefaultExcludes = useDefaultExcludes;
//# sourceMappingURL=use-default-excludes.js.map