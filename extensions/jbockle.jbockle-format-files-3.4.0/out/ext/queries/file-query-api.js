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
exports.FileQueryApi = void 0;
const vscode_1 = require("vscode");
const fdir_1 = require("fdir");
const path = require("path");
const mm = require("micromatch");
const config_1 = require("../utilities/config");
const logger_1 = require("../utilities/logger");
/**
 * use cases
 * 1. by workspace
 * 2. by folder in workspace
 * 3. by glob in workspace
 *
 * exclusion use cases
 * - config exclusions
 * - git exclusions
 */
class FileQueryApi {
    constructor(workspaceFolder, folderOrGlob) {
        this.workspaceFolder = workspaceFolder;
        this.folderOrGlob = folderOrGlob;
        this._config = config_1.Config.instance;
        this._logger = new logger_1.Logger('files-api');
        this.useDefaultExcludes = true;
    }
    static getWorkspaceFiles(workspaceFolder, inFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FileQueryApi(workspaceFolder, inFolder).execute();
        });
    }
    static getWorkspaceFilesWithGlob(workspaceFolder, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = new FileQueryApi(workspaceFolder, options.glob);
            api.useDefaultExcludes = options.useDefaultExcludes;
            return api.execute();
        });
    }
    isByGlob(folderOrGlob) {
        return !!this.folderOrGlob && typeof this.folderOrGlob === 'string';
    }
    isByFolder(folderOrGlob) {
        return folderOrGlob instanceof vscode_1.Uri;
    }
    getIncludeFilter() {
        this._logger.info('\tgetting include filter');
        if (this.isByGlob(this.folderOrGlob)) {
            const glob = this.folderOrGlob;
            this._logger.info(`\t\tfiltering by glob: ${this.folderOrGlob}`);
            return (file) => {
                const pathAsRelative = path.relative(this.workspaceFolder.uri.fsPath, file);
                const matches = mm.isMatch(pathAsRelative, glob);
                this._logger.debug(`\t\t\tmatches glob:${matches}\t${pathAsRelative}`);
                return matches;
            };
        }
        else if (this._config.extensionsToInclude.length) {
            this._logger.info(`\tfiltering by extensions: ${this._config.extensionsToInclude.join(',')}`);
            const extensions = this._config.extensionsToInclude.map(ext => ext.startsWith('.') ? ext : '.' + ext);
            return (file) => {
                const matches = extensions.some(e => file.endsWith(e));
                this._logger.debug(`\t\t\tmatches extension:${matches}\t${file}`);
                return matches;
            };
        }
        this._logger.warn(`\tno filters specified`);
    }
    getExcludeFilter() {
        this._logger.info(`\tgetting exclude filter`);
        if (!this.useDefaultExcludes) {
            return;
        }
        const exclusions = this._config.excludePattern
            .split(',')
            .map(exclusion => exclusion.trim())
            .filter(exclusion => !!exclusion);
        if (this._config.inheritWorkspaceExcludedFiles) {
            this._logger.info(`\t\tincluding files.exclude globs: ${this._config.workspaceExcludes.join(',')}`);
            this._config.workspaceExcludes.forEach((exc) => exclusions.push(exc));
        }
        const exclusionsGlob = `{${exclusions.join(',')}}`;
        this._logger.info(`\t\texclusions glob: ${exclusionsGlob}`);
        return (file) => {
            const pathAsRelative = path.relative(this.workspaceFolder.uri.fsPath, file);
            const ignored = mm.isMatch(pathAsRelative, exclusionsGlob);
            this._logger.debug(`\t\t\texcluded:${ignored}\t${pathAsRelative}`);
            return !ignored;
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(`searching for files in workspace ${this.workspaceFolder.uri.fsPath}`);
            let builder = new fdir_1.fdir().withFullPaths();
            const includeFilter = this.getIncludeFilter();
            if (includeFilter) {
                builder = builder.filter(includeFilter);
            }
            const excludeFilter = this.getExcludeFilter();
            if (excludeFilter) {
                builder = builder.filter(excludeFilter);
            }
            if (this._config.excludedFolders.length) {
                const excludedFolders = this._config.excludedFolders.map(folder => path.resolve(this.workspaceFolder.uri.fsPath, folder));
                builder = builder.exclude((_directoryName, directoryPath) => {
                    return excludedFolders.some(excludedFolder => {
                        return directoryPath.startsWith(excludedFolder);
                    });
                });
            }
            this.isByFolder(this.folderOrGlob) && this._logger.info(`\tfiltering by folder: ${this.folderOrGlob.fsPath}`);
            const searcher = this.isByFolder(this.folderOrGlob)
                ? builder.crawl(this.folderOrGlob.fsPath) // search for specified folder
                : builder.crawl(this.workspaceFolder.uri.fsPath); // search within workspace folder
            this._logger.info('\texecuting search');
            const output = yield searcher.withPromise();
            if (Array.isArray(output)) {
                this._logger.info(`\tfound files: ${output.length}\r\n${output.join('\r\n')}`);
                return output.map(vscode_1.Uri.file);
            }
            this._logger.warn('did not find any files');
            return [];
        });
    }
}
exports.FileQueryApi = FileQueryApi;
//# sourceMappingURL=file-query-api.js.map