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
const subprocess = require("child_process");
const VariableResolver_1 = require("./VariableResolver");
const exceptions_1 = require("../util/exceptions");
class CommandHandler {
    constructor(args, userInputContext) {
        this.EOL = /\r\n|\r|\n/;
        this.inputOptions = {
            canPickMany: false,
            matchOnDescription: true,
            matchOnDetail: true
        };
        if (!args.hasOwnProperty('command')) {
            throw new exceptions_1.ShellCommandException('Please specify the "command" property.');
        }
        this.inputId = this.resolveCommandToInputId(args.command);
        if (args.description !== undefined) {
            this.inputOptions.placeHolder = args.description;
        }
        this.userInputContext = userInputContext;
        this.args = args;
    }
    resolveArgs() {
        return __awaiter(this, void 0, void 0, function* () {
            const resolver = new VariableResolver_1.VariableResolver();
            const command = yield resolver.resolve(this.args.command, this.userInputContext);
            if (command === undefined) {
                throw new exceptions_1.ShellCommandException('Your command is badly formatted and variables could not be resolved');
            }
            else {
                this.args.command = command;
            }
            if (this.args.env !== undefined) {
                for (const key in this.args.env) {
                    if (this.args.env.hasOwnProperty(key)) {
                        this.args.env[key] = (yield resolver.resolve(this.args.env[key], this.userInputContext)) || '';
                    }
                }
            }
            this.args.cwd = this.args.cwd ? yield resolver.resolve(this.args.cwd, this.userInputContext) : vscode.workspace.workspaceFolders[0].uri.fsPath;
        });
    }
    handle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resolveArgs();
            const result = this.runCommand();
            const nonEmptyInput = this.parseResult(result);
            const useFirstResult = (this.args.useFirstResult
                || (this.args.useSingleResult && nonEmptyInput.length === 1));
            if (useFirstResult) {
                if (this.inputId && this.userInputContext) {
                    this.userInputContext.recordInput(this.inputId, nonEmptyInput[0].value);
                }
                return nonEmptyInput[0].value;
            }
            else {
                return this.quickPick(nonEmptyInput);
            }
        });
    }
    runCommand() {
        const options = {
            encoding: 'utf8',
            cwd: this.args.cwd,
            env: this.args.env,
            maxBuffer: this.args.maxBuffer,
        };
        return subprocess.execSync(this.args.command, options);
    }
    parseResult(result) {
        return result
            .split(this.EOL)
            .map((value) => {
            var _a;
            const values = value.trim().split(this.args.fieldSeparator, 4);
            return {
                value: values[0],
                label: (_a = values[1], (_a !== null && _a !== void 0 ? _a : value)),
                description: values[2],
                detail: values[3]
            };
        })
            .filter((item) => item.label && item.label.trim().length > 0);
    }
    quickPick(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (input.length == 0) {
                input = (_a = this.args.defaultOptions, (_a !== null && _a !== void 0 ? _a : []));
            }
            return vscode.window.showQuickPick(input, this.inputOptions).then((selection) => {
                var _a;
                let didCancelQuickPickSession = !selection;
                if (didCancelQuickPickSession) {
                    this.userInputContext.reset();
                }
                else if (this.inputId) {
                    this.userInputContext.recordInput(this.inputId, selection.value);
                }
                return (_a = selection) === null || _a === void 0 ? void 0 : _a.value;
            });
        });
    }
    resolveCommandToInputId(cmd) {
        var _a;
        // Lookup the inputId from the supplied command input string
        if (!cmd)
            return undefined;
        const launchInputs = vscode.workspace.getConfiguration().get('launch.inputs') || [];
        const taskInputs = vscode.workspace.getConfiguration().get('tasks.inputs') || [];
        let inputs = [];
        if (Array.isArray(launchInputs))
            inputs = inputs.concat(launchInputs);
        if (Array.isArray(taskInputs))
            inputs = inputs.concat(taskInputs);
        return (_a = inputs.filter(input => input && input.args && input.args.command && input.args.command == cmd)[0]) === null || _a === void 0 ? void 0 : _a.id;
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map