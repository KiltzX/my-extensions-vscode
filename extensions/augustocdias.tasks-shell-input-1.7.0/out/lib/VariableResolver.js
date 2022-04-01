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
const vscode = require("vscode");
const path = require("path");
class VariableResolver {
    constructor() {
        this.expressionRegex = /\$\{(.*?)\}/gm;
        this.workspaceRegex = /workspaceFolder\[(\d+)\]/gm;
        this.configVarRegex = /config:(.+)/m;
        this.envVarRegex = /env:(.+)/m;
        this.inputVarRegex = /input:(.+)/m;
        this.commandVarRegex = /command:(.+)/m;
    }
    resolve(str, userInputContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            // Process the synchronous string interpolations
            let result = str.replace(this.expressionRegex, (_, value) => {
                if (this.workspaceRegex.test(value)) {
                    return this.bindIndexedFolder(value);
                }
                if (this.configVarRegex.test(value)) {
                    return this.bindWorkspaceConfigVariable(value);
                }
                if (this.envVarRegex.test(value)) {
                    return this.bindEnvVariable(value);
                }
                if (userInputContext && this.inputVarRegex.test(value)) {
                    return this.bindInputVariable(value, userInputContext);
                }
                if (this.commandVarRegex.test(value)) {
                    // We don't replace these yet, they have to be done asynchronously
                    promises.push(this.bindCommandVariable(value));
                    return _;
                }
                return this.bindConfiguration(value);
            });
            // Process the async string interpolations
            const data = yield Promise.all(promises);
            result = result.replace(this.expressionRegex, () => { var _a; return _a = data.shift(), (_a !== null && _a !== void 0 ? _a : ''); });
            return result === '' ? undefined : result;
        });
    }
    bindCommandVariable(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = this.commandVarRegex.exec(value);
            if (!match)
                return '';
            let command = match[1];
            let result = yield vscode.commands.executeCommand(command);
            return result;
        });
    }
    bindIndexedFolder(value) {
        return value.replace(this.workspaceRegex, (_, index) => {
            const idx = Number.parseInt(index);
            if (vscode.workspace.workspaceFolders !== undefined &&
                vscode.workspace.workspaceFolders[idx]) {
                return vscode.workspace.workspaceFolders[idx].uri.fsPath;
            }
            return '';
        });
    }
    bindConfiguration(value) {
        switch (value) {
            case 'workspaceFolder':
                return vscode.workspace.workspaceFolders[0].uri.fsPath;
            case 'workspaceFolderBasename':
                return vscode.workspace.workspaceFolders[0].name;
            case 'fileBasenameNoExtension':
                if (vscode.window.activeTextEditor !== null) {
                    let filePath = path.parse(vscode.window.activeTextEditor.document.fileName);
                    return filePath.name;
                }
                return '';
            case 'fileBasename':
                if (vscode.window.activeTextEditor !== null) {
                    let filePath = path.parse(vscode.window.activeTextEditor.document.fileName);
                    return filePath.base;
                }
                return '';
            case 'file':
                return (vscode.window.activeTextEditor !== null)
                    ? vscode.window.activeTextEditor.document.fileName
                    : '';
            case 'extension':
                if (vscode.window.activeTextEditor !== null) {
                    let filePath = path.parse(vscode.window.activeTextEditor.document.fileName);
                    return filePath.ext;
                }
                return '';
            case 'fileDirName':
                return (vscode.window.activeTextEditor !== null)
                    ? path.dirname(vscode.window.activeTextEditor.document.uri.fsPath)
                    : '';
        }
        return '';
    }
    bindWorkspaceConfigVariable(value) {
        var _a;
        let matchResult = this.configVarRegex.exec(value);
        if (!matchResult) {
            return '';
        }
        // Get value from workspace configuration "settings" dictionary
        let workspaceResult = vscode.workspace.getConfiguration().get(matchResult[1], '');
        if (workspaceResult) {
            return workspaceResult;
        }
        let activeFolderResult = vscode.workspace.getConfiguration("", (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri).get(matchResult[1], '');
        if (activeFolderResult) {
            return activeFolderResult;
        }
        for (const w of vscode.workspace.workspaceFolders) {
            let currentFolderResult = vscode.workspace.getConfiguration("", w.uri).get(matchResult[1], '');
            if (currentFolderResult) {
                return currentFolderResult;
            }
        }
        return "";
    }
    bindEnvVariable(value) {
        let result = this.envVarRegex.exec(value);
        if (!result) {
            return '';
        }
        return process.env[result[1]] || '';
    }
    bindInputVariable(value, userInputContext) {
        let result = this.inputVarRegex.exec(value);
        if (!result) {
            return '';
        }
        return userInputContext.lookupInputValue(result[1]) || '';
    }
}
exports.VariableResolver = VariableResolver;
//# sourceMappingURL=VariableResolver.js.map