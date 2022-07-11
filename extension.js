const vscode = require('vscode');
const path = require('path')
/**
 * @param {vscode.ExtensionContext} context                                                         
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('docgen.replaceWithVaryLength', function () {
		var len = 60;
		var editor;
		var document;
		var selection_1;
		var word;
		var wordLen;
		var replaceLen;
		var replace;
		editor = vscode.window.activeTextEditor;
		if (editor) {

			document = editor.document;

			selection_1 = editor.selection;

			word = document.getText(selection_1);

			wordLen = word.length;

			while (wordLen + 6 > len) {
				len += 20;
			}

			replaceLen = Math.floor((len - wordLen) / 2);

			replace = " " + word + " ";

			for (let i = 0; i < replaceLen - 1; i++) {
				replace = "*" + replace + "*";
			}

			if (replace.length < len) {
				replace += "*";
			}

			replace = "/" + replace + "/"
			editor.edit(function (editBuilder) {
				editBuilder.replace(selection_1, replace);
			});
		}
	});
	context.subscriptions.push(disposable);

	let disposable1 = vscode.commands.registerCommand('docgen.replaceWithFixedLength', function () {
		var headerTrailerLenghth = 10;
		var editor;
		var document;
		var selection_1;
		var word;
		var replace;

		editor = vscode.window.activeTextEditor;

		if (editor) {

			document = editor.document;

			selection_1 = editor.selection;

			word = document.getText(selection_1);

			replace = " " + word + " ";

			for (let i = 0; i < headerTrailerLenghth; i++) {
				replace = "*" + replace + "*";
			}

			replace = "/" + replace + "/"
			editor.edit(function (editBuilder) {
				editBuilder.replace(selection_1, replace);
			});
		}
	});
	context.subscriptions.push(disposable1);

	let disposable2 = vscode.commands.registerCommand('docgen.genSingleLineFuncDes', function () {

		var editor = vscode.window.activeTextEditor;
		var document;
		var selection_1;
		var content = "";
		var functionLineNumber;
		var functionLineText;
		var commentLineTitle = "";
		var commentLine;
		var commentLineRange;

		if (editor) {

			document = editor.document;

			selection_1 = editor.selection;

			functionLineNumber = selection_1.active.line;

			functionLineText = document.lineAt(functionLineNumber).text;

			/* Extract content */
			for (let i = functionLineText.length - 3; i >= 0; i--) {
				if (functionLineText[i] !== " ") {
					for (let j = i; j >= 0; j--) {
						if (functionLineText[j] === "|") {
							break;
						}
						content = functionLineText[j] + content;
					}
					break;
				}
			}

			/* Extract line's title */
			for (let i = 0; i < functionLineText.length; i++) {
				commentLineTitle += functionLineText[i];
				if (functionLineText[i] == "|") {
					break;
				}
			}

			/* Build comment line */
			commentLine = commentLineTitle + content;
			while (commentLine.length < 76) {
				commentLine += " ";
			}
			commentLine += "*/";

			commentLineRange = document.lineAt(functionLineNumber).range;
			editor.edit(function (editBuilder) {
				editBuilder.replace(commentLineRange, commentLine);
			});
		}
	});
	context.subscriptions.push(disposable2);

	let disposable3 = vscode.commands.registerCommand('docgen.genFunctionDesc', function () {

		var editor = vscode.window.activeTextEditor;
		var document;
		var selection_1;
		var replace;
		var functionName = "";
		var functionLineNumber;
		var functionLineText;
		var commentFuncNameLine;

		if (editor) {

			document = editor.document;

			selection_1 = editor.selection;

			functionLineNumber = selection_1.active.line;

			functionLineText = document.lineAt(functionLineNumber + 1).text;

			/* Extract the name of function */
			for (let i = functionLineText.length - 1; i >= 0; i--) {
				if (functionLineText[i] === "(") {
					for (let j = i - 1; ; j--) {
						if (functionLineText[j] === " " || functionLineText[j] === ":") {
							break;
						}
						functionName = functionLineText[j] + functionName;
					}
					break;
				}
			}

			/* Build Function Name comment line */
			commentFuncNameLine = "/* Function Name | " + functionName;
			while (commentFuncNameLine.length < 76) {
				commentFuncNameLine += " ";
			}
			commentFuncNameLine += "*/\n";

			replace = "/****************************************************************************/\n"
				+ commentFuncNameLine
				+ "/* Description   |                                                          */\n"
				+ "/* Preconditions |                                                          */\n"
				+ "/* Parameters    |                                                          */\n"
				+ "/* Return Value  |                                                          */\n"
				+ "/* Notes         |                                                          */\n"
				+ "/****************************************************************************/";

			editor.edit(function (editBuilder) {
				editBuilder.replace(selection_1, replace);
			});
		}
	});
	context.subscriptions.push(disposable3);

	let disposable4 = vscode.commands.registerCommand('docgen.test', async function () {
		/***************************** Webview test *****************************/

		// const panel = vscode.window.createWebviewPanel("shortcut","DocGen Shortcut", vscode.ViewColumn.One,{});
		// panel.webview.html = getWebviewContent();

		/*****************************  *****************************/
		var editor = vscode.window.activeTextEditor;
		var functionName = "";

		if (editor) {

			var document = editor.document;

			var selection_1 = editor.selection;

			var functionLine = selection_1.active.line;

			var functionLineText = document.lineAt(functionLine + 1).text;

			for (let i = functionLineText.length - 1; i >= 0; i--) {
				if (functionLineText[i] === "(") {
					for (let j = i - 1; ; j--) {
						if (functionLineText[j] === " " || functionLineText[j] === ":") {
							break;
						}
						functionName = functionLineText[j] + functionName;
					}
					break;
				}
			}

			var commentFuncNameLine = "/* Function Name | " + functionName;
			while (commentFuncNameLine.length < 76) {
				commentFuncNameLine += " ";
			}
			commentFuncNameLine += "*/";
			console.log(commentFuncNameLine);

			/*****************************  *****************************/
			for (let i = functionLineText.length - 1; i >= 0; i--) {
				if (functionLineText[i] !== ";") {
					functionLineText = functionLineText.substring(0, functionLineText.length - 1);
				} else {
					functionLineText = functionLineText.substring(0, functionLineText.length - 1);
					break;
				}
			}
			functionLineText = functionLineText.trim();
			functionLineText += "\n" + "{" + "\n" + "}" + "\n\n";
			console.log(functionLineText);

			var fileName = document.fileName;
			for (let i = fileName.length; i >= 0; i--) {
				if (fileName[i - 1] !== ".") {
					fileName = fileName.substring(0, fileName.length - 1);
				} else {
					break;
				}
			}
			fileName += "cpp";

			vscode.workspace.openTextDocument(fileName).then(doc => {
				vscode.window.showTextDocument(doc).then(editor1 => {
					if (editor1) {
						var lineCount = doc.lineCount;
						console.log(lineCount);
						var positon = new vscode.Position(lineCount - 1, 0);
						editor1.edit(function (editBuilder) {
							editBuilder.replace(positon, functionLineText);
						});

						var newSelection = new vscode.Selection(positon, positon);
						editor.selection = newSelection;
					}
				})
			})
			var input = ""
			await vscode.window.showInputBox({ ignoreFocusOut: true, placeHolder: "Enter Class Name" }).then(s => {
				input = s
			});

			// while(input === "" || input === undefined) {}
			var newFile = vscode.Uri.parse('untitled:' + path.join(path.dirname(document.fileName), 'safsa.h'));
			console.log(newFile.fsPath);
			vscode.workspace.openTextDocument(newFile).then(doc => {
				doc.save().then();
				vscode.window.showTextDocument(doc).then(editor => {
					var position = new vscode.Position(0, 0);
					editor.edit(function (editBuilder) {
						editBuilder.replace(position, "fileContent");
					});
				})
			})
			/*****************************  *****************************/
			// var word = document.getText(selection_1);
			// console.log(word);

			// editor.edit(function (editBuilder) {
			// 	editBuilder.replace(selection_1, replace);
			// });
		} else {
			const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'safsa.h'));
			console.log(newFile.fsPath);
			vscode.workspace.openTextDocument(newFile).then(doc => {
				doc.save().then();
				vscode.window.showTextDocument(doc).then(editor => {
					var newSelection = new vscode.Selection(position, position);
					editor.selection = newSelection;
					var position = new vscode.Position(0, 0);
					editor.edit(function (editBuilder) {
						editBuilder.replace(position, "fileContent");
					});
				})
			})
		}
	});
	context.subscriptions.push(disposable4);

	let disposable5 = vscode.commands.registerCommand('docgen.genDefinition', function () {
		var editor = vscode.window.activeTextEditor;
		var functionLine;
		var functionLineText;
		var document;
		var fileName;
		var className = "";
		var fileExtension = "";

		if (editor) {
			document = editor.document;

			functionLine = editor.selection.active.line;

			/****************** Build source file name ******************/
			fileName = document.fileName;
			for (let i = fileName.length - 1; i >= 0; i--) {
				if (fileName[i] !== ".") {
					fileExtension = fileName[i] + fileExtension;
					fileName = fileName.substring(0, fileName.length - 1);
				} else {
					/* Get class name */
					for (let j = i - 1; j >= 0; j--) {
						if (fileName[j] !== "\\") {
							className = fileName[j] + className;
						} else {
							break;
						}
					}
					break;
				}
			}

			if (fileExtension === "hpp") {
				fileName += "cpp";
			} else {
				fileName += "c";
			}
			/*********** Build function definition prototype ************/
			functionLineText = document.lineAt(functionLine).text;

			for (let i = functionLineText.length - 1; i >= 0; i--) {
				if (functionLineText[i] !== ";") {
					functionLineText = functionLineText.substring(0, functionLineText.length - 1);
				} else {
					functionLineText = functionLineText.substring(0, functionLineText.length - 1);
					break;
				}
			}

			functionLineText = functionLineText.trim();
			/* Add class name before function name */
			if (fileExtension === "hpp") {
				for (let i = functionLineText.length - 1; i >= 0; i--) {
					if (functionLineText[i] === "(") {
						for (let j = i - 1; j >= 0; j--) {
							if (functionLineText[j] === " ") {
								functionLineText = functionLineText.slice(0, j + 1) + className + "::" + functionLineText.slice(j + 1, functionLineText.length);
								break;
							}
						}
						break;
					}
				}
			}
			functionLineText += "\n" + "{" + "\n" + "}" + "\n\n";

			/****************** Switch to source file *******************/
			vscode.workspace.openTextDocument(fileName).then(doc => {
				vscode.window.showTextDocument(doc).then(editor1 => {
					if (editor1) {
						/* Add function definition to soucre file */
						var lineCount = doc.lineCount;

						var position = new vscode.Position(lineCount, 0);

						editor1.edit(function (editBuilder) {
							editBuilder.replace(position, functionLineText);
						});
						/* Move cursor to newly function position*/
						editor = vscode.window.activeTextEditor;
						var newSelection = new vscode.Selection(position, position);
						editor.selection = newSelection;
					}
				})
			})
		}
	});
	context.subscriptions.push(disposable5);

	let disposable6 = vscode.commands.registerCommand("docgen.shortcutInfo", function () {
		const panel = vscode.window.createWebviewPanel("shortcut", "DocGen Shortcut", vscode.ViewColumn.One, {});
		panel.webview.html = getWebviewContent();
	});
	context.subscriptions.push(disposable6);

	let disposable7 = vscode.commands.registerCommand("docgen.genHeaderFile", function () {
		var editor = vscode.window.activeTextEditor;
		var document;
		var fileName;
		var className = "";
		var fileExtension = "";
		var fileContent = "";
		var position;

		if (editor) {
			document = editor.document;

			fileName = document.fileName;
			for (let i = fileName.length - 1; i >= 0; i--) {
				if (fileName[i] === "\\") {
					fileName = fileName.substring(i + 1, fileName.length);
					break;
				}
			}

			for (let i = 0; i < fileName.length; i++) {
				if (fileName[i] === ".") {
					className = fileName.substring(0, i);
					fileExtension = fileName.substring(i + 1, fileName.length);
				}
			}

			if (fileExtension === "h" || fileExtension === "hpp") {
				fileContent = getHeaderFileContent(fileName, className);

				position = new vscode.Position(0, 0);
				editor.edit(function (editBuilder) {
					editBuilder.replace(position, fileContent);
				});
			} else {
				vscode.window.showErrorMessage("Not a header file !");
			}
		}
	});
	context.subscriptions.push(disposable7);

	let disposable8 = vscode.commands.registerCommand("docgen.genSourceFile", function () {
		var editor = vscode.window.activeTextEditor;
		var document;
		var fileName;
		var fileExtension = "";
		var fileContent = "";
		var position;

		if (editor) {
			document = editor.document;

			fileName = document.fileName;
			for (let i = fileName.length - 1; i >= 0; i--) {
				if (fileName[i] === "\\") {
					fileName = fileName.substring(i + 1, fileName.length);
					break;
				}
			}

			for (let i = 0; i < fileName.length; i++) {
				if (fileName[i] === ".") {
					fileExtension = fileName.substring(i + 1, fileName.length);
				}
			}

			if (fileExtension === "c" || fileExtension === "cpp") {
				fileContent = getSourceFileContent(fileName, "");

				position = new vscode.Position(0, 0);
				editor.edit(function (editBuilder) {
					editBuilder.replace(position, fileContent);
				});
			} else {
				vscode.window.showErrorMessage("Not a source file !");
			}
		}
	});
	context.subscriptions.push(disposable8);

	let disposable9 = vscode.commands.registerCommand("docgen.genClass", async function () {
		var editor = vscode.window.activeTextEditor;

		var input = ""
		await vscode.window.showInputBox({ ignoreFocusOut: true, placeHolder: "Enter Class Name" }).then(s => {
			input = s
		});

		if (editor) {
			var document = editor.document;

			if (input !== "" || input !== undefined) {
				/***************************** Create header file *****************************/
				var content = getHeaderFileContent(input + ".hpp", input);
				var newFile = vscode.Uri.parse('untitled:' + path.join(path.dirname(document.fileName), input + '.hpp'));
				await vscode.workspace.openTextDocument(newFile).then(async function (doc) {
					await vscode.window.showTextDocument(doc).then(async function (editor) {
						var position = new vscode.Position(0, 0);
						await editor.edit(function (editBuilder) {
							editBuilder.replace(position, content);
						});
					})
					await doc.save().then();
				})
				/***************************** Create source file *****************************/
				content = getSourceFileContent(input + ".cpp", input);
				newFile = vscode.Uri.parse('untitled:' + path.join(path.dirname(document.fileName), input + '.cpp'));
				await vscode.workspace.openTextDocument(newFile).then(async function (doc) {
					await vscode.window.showTextDocument(doc).then(async function (editor) {
						var position = new vscode.Position(0, 0);
						await editor.edit(function (editBuilder) {
							editBuilder.replace(position, content);
						});
					})
					await doc.save().then();
				})
			}
		} else {
			/***************************** Create header file *****************************/
			var content = getHeaderFileContent(input + ".hpp", input);
			var newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, input + '.hpp'));
			await vscode.workspace.openTextDocument(newFile).then(async function (doc) {
				await vscode.window.showTextDocument(doc).then(async function (editor) {
					var position = new vscode.Position(0, 0);
					await editor.edit(function (editBuilder) {
						editBuilder.replace(position, content);
					});
				})
				await doc.save().then();
			})
			/***************************** Create source file *****************************/
			content = getSourceFileContent(input + ".cpp", input);
			newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, input + '.cpp'));
			await vscode.workspace.openTextDocument(newFile).then(async function (doc) {
				await vscode.window.showTextDocument(doc).then(async function (editor) {
					var position = new vscode.Position(0, 0);
					await editor.edit(function (editBuilder) {
						editBuilder.replace(position, content);
					});
				})
				await doc.save().then();
			})
		}
	});
	context.subscriptions.push(disposable9);
}

// this method is called when your extension is deactivated
function deactivate() { }
function getWebviewContent() {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
	
		<style>
			p {
				color:rgb(107, 142, 238);
			}
		</style>
	
	</head>
	<body>
		<h1>Shortcut Information</h1>
		<h2>Alt + Z :</h2>
		<p>/*****************************  *****************************/</p>
		<h2>Alt + X :</h2>
		<p>/**********  **********/</p>
		<h2>Alt + C :</h2>
		<p>/****************************************************************************/
		<p>/* Function Name |                                                          */</p>
		<p>/* Description   |                                                          */</p>
		<p>/* Preconditions |                                                          */</p>
		<p>/* Parameters    |                                                          */</p>
		<p>/* Return Value  |                                                          */</p>
		<p>/* Notes         |                                                          */</p>
		<p>/****************************************************************************/</p>
		<h2>Alt + V :</h2>
		<p>Auto arrange for Alt + C</p>
		<h2>Alt + N :</h2>
		<p>Generate function definition</p>
	</body>
	</html>`
}

function getHeaderFileContent(fileName, className) {
	var content = "";
	var length = 78;
	var objectName = "/* Object Name  | ";
	var defineName = "";

	/* Generate define name */
	defineName = fileName.toUpperCase();
	defineName = defineName.replace(".", "_");
	/* Generate object name field */
	objectName += fileName;
	while (objectName.length < (length - 2)) {
		objectName += " ";
	}
	objectName += "*/\n";

	content += "/****************************************************************************/\n"
		+ objectName
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Author       |                                                           */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Decription   |                                                           */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Notes        |                                                           */\n"
		+ "/****************************************************************************/\n"
		+ "\n"
		+ "#ifndef " + defineName + "\n"
		+ "#define " + defineName + "\n"
		+ "\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Include Files                                                            */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Macros                                                                   */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Types                                                                    */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Function Prototypes                                                      */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Data                                                                     */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Constants                                                                */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "class " + className + "{\n"
		+ "\n"
		+ "};\n"
		+ "\n\n"
		+ "#endif " + "/* " + defineName + " */\n\n"
		+ "/****************************************************************************/\n"
		+ "/* History                                                                  */\n"
		+ "/* Version:         Date                                                    */\n"
		+ "/* Mod. History:                                                            */\n"
		+ "/****************************************************************************/\n"
		+ "\n"
		+ "/**** End of File ***********************************************************/\n"

	return content;
}

function getSourceFileContent(fileName, className) {
	var content = "";
	var length = 78;
	var objectName = "/* Object Name  | ";

	/* Generate object name field */
	objectName += fileName;
	while (objectName.length < (length - 2)) {
		objectName += " ";
	}
	objectName += "*/\n";
	if (className !== "" && className !== undefined) {
		className = "#include \"" + className + ".hpp\"\n";
	}
	content += "/****************************************************************************/\n"
		+ objectName
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Author       |                                                           */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Decription   |                                                           */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Notes        |                                                           */\n"
		+ "/****************************************************************************/\n"
		+ "\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Include Files                                                            */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ className
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Macros                                                                   */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Types                                                                    */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Function Prototypes                                                      */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Data                                                                     */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "/* Constants                                                                */\n"
		+ "/*--------------------------------------------------------------------------*/\n"
		+ "\n\n"
		+ "/****************************************************************************/\n"
		+ "/* External Functions                                                       */\n"
		+ "/****************************************************************************/\n"
		+ "\n\n"
		+ "/****************************************************************************/\n"
		+ "/* Internal Functions                                                       */\n"
		+ "/****************************************************************************/\n"
		+ "\n\n"
		+ "/****************************************************************************/\n"
		+ "/* History                                                                  */\n"
		+ "/* Version:         Date                                                    */\n"
		+ "/* Mod. History:                                                            */\n"
		+ "/****************************************************************************/\n"
		+ "\n"
		+ "/**** End of File ***********************************************************/\n"

	return content;
}

module.exports = {
	activate,
	deactivate
}
