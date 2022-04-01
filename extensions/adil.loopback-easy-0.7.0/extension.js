// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const fs = require('fs');
	const path = require('path');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "loopback-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.createRemoteMethod', function () {
		// The code you place here will be executed every time your command is executed
		// vscode.window.showInputBox().then(data=>console.log(data))
		let model = 'Model';
		let methodName = 'methodName'
		const camelToDash = (inputString) => inputString.replace(/\.?([A-Z]+)/g, "-$1").toLowerCase();
		let methodTemplate = `module.exports = function (${model}) {
			${model}.${methodName} = function( options, arg1) {
				try {
					const token = options && options.accessToken;
					const userId = token && token.userId;
				}
				catch(error){
					throw error;
				}

			}

			${model}.remoteMethod('${methodName}',{
accepts: [{
	arg: 'options',
	type: 'object',
	http: 'optionsFromRequest'
  }, {
	  arg: 'arg1',
	  type: 'string',
	  required: true
  }],returns: {
	arg: 'data',
	type: 'object',
	root: true
  },
  http: {
	verb: 'post',
	path: '/customPath'
  }
});
		}`;
		const folderPath = vscode.workspace.workspaceFolders[0].uri
			.path;
		fs.readFile(path.join(folderPath, 'server', 'model-config.json'), async (err, file) => {
			if (err) console.log(err);
			const models = JSON.parse(file);

			const modelList = [];
			for (const key in models) {
				if (models.hasOwnProperty(key)) {
					if (key !== '_meta')
						modelList.push({ label: key });
				}
			}
			model = await vscode.window.showQuickPick(modelList, { placeHolder: 'Choose Model' });
			const methodName = await vscode.window.showInputBox({ placeHolder: 'methodName' });
			let methodTemplate = `module.exports = function (${
				model.label
				}) {
				${
				model.label
				}.${
				methodName
				} = function (options, arg1) {
				  try {
					const token = options && options.accessToken;
					const userId = token && token.userId;
				  } catch (error) {
					throw error;
				  }
			  
				}
			  
				${
				model.label
				}.remoteMethod('${methodName}', {
				  accepts: [{
					arg: 'options',
					type: 'object',
					http: 'optionsFromRequest'
				  }, {
					arg: 'arg1',
					type: 'string',
					required: true
				  }] ,returns: {
					arg: 'data',
					type: 'object',
					root: true
				  },
				  http: {
					verb: 'post',
					path: '/customPath'
				  }
				});
			  }
			  `;
			const filePath = await vscode.window.showOpenDialog({ ignoreFocusOut: true, canSelectFolders: true, defaultUri: vscode.Uri.file(folderPath) });
			fs.writeFile(path.join(filePath[0].path, `${camelToDash(methodName)}.js`), methodTemplate, (err) => {
				if (err) {
					return vscode.window.showErrorMessage(
						"Failed to create boilerplate file!"
					);
				}
				vscode.window.showInformationMessage("Created remote method boilerplate file");
			});

		})

		// vscode.window.showOpenDialog({ ignoreFocusOut: true, canSelectFolders: true, defaultUri: vscode.Uri.file(folderPath) }).then((data) => console.log(data))
		// vscode.window.showQuickPick().then(data=>console.log(data));
		// Display a message box to the user

	});


	let createHook = vscode.commands.registerCommand('extension.createRemoteHook', function () {
		// The code you place here will be executed every time your command is executed
		// vscode.window.showInputBox().then(data=>console.log(data))
		try {
			let model = 'Model';
			let methodName = 'methodName'
			const camelToDash = (inputString) => inputString.replace(/\.?([A-Z]+)/g, "-$1").toLowerCase();

			const folderPath = vscode.workspace.workspaceFolders[0].uri
				.path;
			fs.readFile(path.join(folderPath, 'server', 'model-config.json'), async (err, file) => {
				if (err) console.log(err);
				const models = JSON.parse(file);

				const modelList = [];
				for (const key in models) {
					if (models.hasOwnProperty(key)) {
						if (key !== '_meta')
							modelList.push({ label: key });
					}
				}

				const hookTypes = [{ label: 'before', label: 'after' }];
				model = await vscode.window.showQuickPick(modelList, { placeHolder: 'Choose Model' });
				const hookType = await vscode.window.showQuickPick(hookTypes, { placeholder: 'Choose hook type' });
				const methodName = await vscode.window.showInputBox({ placeHolder: 'methodName' });
				let methodTemplate = `module.exports = function (${
					model.label
					}) {
					${model.label}.${hookType.label}Remote('${methodName}', async (ctx, user) => {
	
					});
				}
					`;
				const filePath = await vscode.window.showOpenDialog({ ignoreFocusOut: true, canSelectFolders: true, defaultUri: vscode.Uri.file(folderPath) });
				fs.writeFile(path.join(filePath[0].path, `${camelToDash(methodName)}.js`), methodTemplate, (err) => {
					if (err) {
						return vscode.window.showErrorMessage(
							"Failed to create boilerplate file!"
						);
					}
					vscode.window.showInformationMessage("Created remote hook boilerplate file");
				});

			});
		} catch (error) {
			vscode.window.showInformationMessage("Unable to execute extension");
		}


		// vscode.window.showOpenDialog({ ignoreFocusOut: true, canSelectFolders: true, defaultUri: vscode.Uri.file(folderPath) }).then((data) => console.log(data))
		// vscode.window.showQuickPick().then(data=>console.log(data));
		// Display a message box to the user

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(createHook);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
