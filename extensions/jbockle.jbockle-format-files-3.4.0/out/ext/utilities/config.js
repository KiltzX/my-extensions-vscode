"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const vscode_1 = require("vscode");
const logger_1 = require("./logger");
class Config {
    constructor() {
        this._excludeFiles = {};
        this._logger = new logger_1.Logger('config');
        this.loadConfigFromWorkspace();
    }
    loadConfigFromWorkspace() {
        var _a;
        this._formatFilesConfig = vscode_1.workspace.getConfiguration().get('formatFiles', { extensionsToInclude: '' });
        this._excludeFiles = vscode_1.workspace.getConfiguration().get('files.exclude', {});
        logger_1.Logger.logLevel = logger_1.LogLevel[(_a = this._formatFilesConfig.logLevel) !== null && _a !== void 0 ? _a : 'info'];
        this._logger.info(`config: ${JSON.stringify(this._formatFilesConfig)}`);
        this._logger.info(`excluded files: ${JSON.stringify(this._excludeFiles)}`);
    }
    get excludedFolders() {
        if (Array.isArray(this._formatFilesConfig.excludedFolders)) {
            return this._formatFilesConfig.excludedFolders;
        }
        return [];
    }
    get extensionsToInclude() {
        let targetExtensions = this._formatFilesConfig.extensionsToInclude;
        // for backwards compatibility, remove { & } if present
        targetExtensions = targetExtensions.replace(/\{|\}/g, '');
        return targetExtensions.split(',')
            .map(ext => ext.trim())
            .filter(ext => !!ext);
    }
    get excludePattern() {
        var _a;
        return (_a = this._formatFilesConfig.excludePattern) !== null && _a !== void 0 ? _a : '';
    }
    get inheritWorkspaceExcludedFiles() {
        var _a;
        return (_a = this._formatFilesConfig.inheritWorkspaceExcludedFiles) !== null && _a !== void 0 ? _a : false;
    }
    get runOrganizeImports() {
        var _a;
        return (_a = this._formatFilesConfig.runOrganizeImports) !== null && _a !== void 0 ? _a : false;
    }
    get workspaceExcludes() {
        return Object.keys(this._excludeFiles)
            .filter(glob => this._excludeFiles[glob])
            .map(glob => glob);
    }
    get useGitIgnore() {
        var _a;
        return (_a = this._formatFilesConfig.useGitIgnore) !== null && _a !== void 0 ? _a : true;
    }
    static load() {
        const config = Config.instance;
        config.loadConfigFromWorkspace();
    }
}
exports.Config = Config;
Config.instance = new Config();
//# sourceMappingURL=config.js.map