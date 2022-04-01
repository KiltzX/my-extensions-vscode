"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInWorkspace = void 0;
const vscode_1 = require("vscode");
const operation_aborted_1 = require("../errors/operation-aborted");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('validate-in-workspace');
function validateInWorkspace() {
    var _a;
    logger.info(`found workspace folders: ${(_a = vscode_1.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.map(folder => folder.name).join(', ')}`);
    if (vscode_1.workspace.workspaceFolders === undefined || vscode_1.workspace.workspaceFolders.length === 0) {
        throw new operation_aborted_1.OperationAborted('Format Files requires an active workspace, please open a workspace and try again');
    }
    logger.info(`workspace is valid!`);
}
exports.validateInWorkspace = validateInWorkspace;
//# sourceMappingURL=validate-in-workspace.js.map