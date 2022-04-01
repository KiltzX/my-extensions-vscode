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
exports.selectWorkspaceFolder = void 0;
const vscode_1 = require("vscode");
const operation_aborted_1 = require("../errors/operation-aborted");
const logger_1 = require("../utilities/logger");
const logger = new logger_1.Logger('select-workspace-folder');
function selectWorkspaceFolder(forFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.workspace.workspaceFolders) {
            if (vscode_1.workspace.workspaceFolders.length === 1) {
                const folder = vscode_1.workspace.workspaceFolders[0];
                logger.info(`a single workspace folder was found, selecting ${folder.name}`);
                return folder;
            }
            else if (vscode_1.workspace.workspaceFolders.length > 1) {
                if (forFolder) {
                    const folder = vscode_1.workspace.workspaceFolders.find(workspace => forFolder.path.startsWith(workspace.uri.path));
                    if (folder) {
                        return folder;
                    }
                }
                return yield requestWorkspaceFolder([...vscode_1.workspace.workspaceFolders]);
            }
        }
        throw new operation_aborted_1.OperationAborted('a workspace folder was not found');
    });
}
exports.selectWorkspaceFolder = selectWorkspaceFolder;
function requestWorkspaceFolder(folders) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode_1.window.showQuickPick(folders.map(folder => folder.name), {
            ignoreFocusOut: true,
            placeHolder: 'Select workspace',
        });
        logger.info(`user selected workspace folder: ${result}`);
        if (!result) {
            throw new operation_aborted_1.OperationAborted('User aborted');
        }
        return folders.find(folder => folder.name === result);
    });
}
//# sourceMappingURL=select-workspace-folder.js.map