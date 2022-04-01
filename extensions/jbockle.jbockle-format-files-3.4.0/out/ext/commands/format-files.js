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
exports.formatFiles = void 0;
const vscode_1 = require("vscode");
const logger_1 = require("../utilities/logger");
const try_open_document_1 = require("./try-open-document");
const operation_aborted_1 = require("../errors/operation-aborted");
const config_1 = require("../utilities/config");
const logger = new logger_1.Logger('format-files');
function formatFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const incrementProgressBy = (1 / files.length) * 100;
        yield vscode_1.window.withProgress({
            cancellable: true,
            location: vscode_1.ProgressLocation.Notification,
            title: 'formatting documents',
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (token.isCancellationRequested) {
                    const message = `Operation cancelled. Processed ${index} files.`;
                    yield showModal(message);
                    throw new operation_aborted_1.OperationAborted(message);
                }
                progress.report({ message: file.fsPath, increment: incrementProgressBy });
                yield formatFile(file);
            }
            if (!token.isCancellationRequested) {
                yield showModal(`Format Files completed. Processed ${files.length} files.`);
            }
        }));
    });
}
exports.formatFiles = formatFiles;
function showModal(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_1.window.showInformationMessage(message, { modal: true });
    });
}
function formatFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`formatting ${file.fsPath}`);
        const doc = yield try_open_document_1.tryOpenDocument(file.path);
        if (doc) {
            yield vscode_1.window.showTextDocument(doc, { preview: false, viewColumn: vscode_1.ViewColumn.One });
            if (config_1.Config.instance.runOrganizeImports) {
                yield vscode_1.commands.executeCommand('editor.action.organizeImports');
            }
            yield vscode_1.commands.executeCommand('editor.action.formatDocument');
            yield vscode_1.commands.executeCommand('workbench.action.files.save');
            yield vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
        }
    });
}
//# sourceMappingURL=format-files.js.map