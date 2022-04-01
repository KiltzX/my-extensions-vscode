"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "remove-console" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('remove-console', () => {
        var _a;
        // The code you place here will be executed every time your command is executed
        let path;
        if (vscode.window.activeTextEditor) {
            path = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.path;
        }
        else {
            return;
        }
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            ;
            let str = data.toString();
            if (/console.(.+)\((.+)\)/ig.test(str)) {
                str = str.replace(/console.(.+)\((.+)\)/ig, '');
                fs.writeFile(path, str, () => {
                    vscode.window.showInformationMessage('console already remove!');
                });
            }
            else {
                vscode.window.showInformationMessage('have no console');
            }
        });
        // Display a message box to the user
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map