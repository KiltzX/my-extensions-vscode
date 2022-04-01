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
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
const logger_1 = require("./ext/utilities/logger");
const prompts_1 = require("./ext/prompts");
const format_files_1 = require("./ext/commands/format-files");
const validate_in_workspace_1 = require("./ext/commands/validate-in-workspace");
const config_1 = require("./ext/utilities/config");
const file_query_api_1 = require("./ext/queries/file-query-api");
const logger = new logger_1.Logger('ext');
function activate(context) {
    logger.info('activating');
    registerCommand(context, constants_1.Constants.formatFiles, formatFilesInWorkspace);
    registerCommand(context, constants_1.Constants.formatFilesFolder, formatFilesInWorkspace);
    registerCommand(context, constants_1.Constants.formatFilesFromGlob, fromGlob);
    logger.info('activated');
}
exports.activate = activate;
function deactivate() {
    logger.info('Format Files deactivated');
}
exports.deactivate = deactivate;
function registerCommand(context, command, callback) {
    logger.info(`registering command ${command}`);
    context.subscriptions
        .push(vscode_1.commands.registerCommand(command, callback));
}
function formatFilesInWorkspace(inFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            config_1.Config.load();
            openOutputChannel();
            logger.info(`Starting Format Files - Workspace ${inFolder ? 'Folder' : ''}`);
            validate_in_workspace_1.validateInWorkspace();
            const workspaceFolder = yield prompts_1.default.selectWorkspaceFolder(inFolder);
            const files = yield file_query_api_1.FileQueryApi.getWorkspaceFiles(workspaceFolder, inFolder);
            yield prompts_1.default.confirmStart(`Format Files: Start formatting ${files.length} workspace files?`);
            yield format_files_1.formatFiles(files);
            logger.info(`Format Files completed`);
        }
        catch (error) {
            logger.error(error);
        }
    });
}
function fromGlob() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            config_1.Config.load();
            openOutputChannel();
            logger.info(`Starting Format Files - By Glob Pattern`);
            validate_in_workspace_1.validateInWorkspace();
            const workspaceFolder = yield prompts_1.default.selectWorkspaceFolder();
            const glob = yield prompts_1.default.requestGlob();
            const useDefaultExcludes = yield prompts_1.default.useDefaultExcludes();
            const files = yield file_query_api_1.FileQueryApi.getWorkspaceFilesWithGlob(workspaceFolder, { glob, useDefaultExcludes });
            yield prompts_1.default.confirmStart(`Format Files: Start formatting ${files.length} workspace files using glob '${glob}'?`);
            yield format_files_1.formatFiles(files);
            logger.info(`Format Files completed`);
        }
        catch (error) {
            logger.error(error);
        }
    });
}
function openOutputChannel() {
    logger_1.Logger.outputChannel.show(true);
    logger_1.Logger.outputChannel.appendLine('');
    logger_1.Logger.outputChannel.appendLine(''.padStart(50, ':'));
}
//# sourceMappingURL=extension.js.map