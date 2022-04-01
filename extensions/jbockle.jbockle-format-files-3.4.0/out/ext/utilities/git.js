"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Git = void 0;
const vscode_1 = require("vscode");
const logger_1 = require("./logger");
const child_process_1 = require("child_process");
class Git {
    constructor() {
        var _a;
        this._logger = new logger_1.Logger('git');
        this._git = (_a = vscode_1.extensions.getExtension('vscode.git')) === null || _a === void 0 ? void 0 : _a.exports.getAPI(1);
    }
    get _gitexe() {
        var _a, _b;
        return (_b = (_a = this._git) === null || _a === void 0 ? void 0 : _a.git.path) !== null && _b !== void 0 ? _b : 'git';
    }
    isIgnored(file) {
        var _a;
        this._logger.info(`checking '${file}' is ignored by git`);
        const repository = (_a = this._git) === null || _a === void 0 ? void 0 : _a.repositories.find(repo => file.path.includes(repo.rootUri.path));
        let ignored = false;
        if (repository) {
            try {
                // if exit code is 0, it is ignored
                this.executeGit({ args: ['check-ignore', '-q', file.fsPath], cwd: repository.rootUri.fsPath });
                ignored = true;
            }
            catch (error) {
                ignored = false;
            }
        }
        this._logger.info(`\tis ignored: ${ignored}`);
        return ignored;
    }
    executeGit(options) {
        return child_process_1.execFileSync(this._gitexe, options.args, { cwd: options.cwd, encoding: 'utf8' });
    }
}
exports.Git = Git;
//# sourceMappingURL=git.js.map