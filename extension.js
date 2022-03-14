const vscode = require('vscode');

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
			for (let i = functionLineText.length - 3; i >= 0 ; i--) {
				if (functionLineText[i] !== " ") {
					for(let j = i; j >= 0; j--) {
						if(functionLineText[j] === "|") {
							break;
						}
						content = functionLineText[j] + content;
					}
					break;
				}
			}
			
			/* Extract line's title */
			for(let i = 0; i < functionLineText.length; i++) {
				commentLineTitle += functionLineText[i];
				if(functionLineText[i] == "|") {
					break;
				}
			}

			/* Build comment line */
			commentLine = commentLineTitle + content;
			while(commentLine.length < 76) {
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
					for(let j = i - 1;; j--) {
						if(functionLineText[j] === " ") {
							break;
						}
						functionName = functionLineText[j] + functionName;
					}
					break;
				}
			}

			/* Build Function Name comment line */
			commentFuncNameLine = "/* Function Name | " + functionName;
			while(commentFuncNameLine.length < 76) {
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

	let disposable4 = vscode.commands.registerCommand('docgen.test', function () {

		var editor = vscode.window.activeTextEditor;
		var functionName = "";

		if (editor) {

			var document = editor.document;

			var selection_1 = editor.selection;

			var functionLine = selection_1.active.line;

			var functionLineText = document.lineAt(functionLine + 1).text;

			for (let i = functionLineText.length - 1; i >= 0; i--) {
				if (functionLineText[i] === "(") {
					for(let j = i - 1;; j--) {
						if(functionLineText[j] === " ") {
							break;
						}
						functionName = functionLineText[j] + functionName;
					}
					break;
				}
			}

			var commentFuncNameLine = "/* Function Name | " + functionName;
			while(commentFuncNameLine.length < 76) {
				commentFuncNameLine += " ";
			}
			commentFuncNameLine += "*/";

			console.log(commentFuncNameLine);
			// var word = document.getText(selection_1);
			// console.log(word);

			// editor.edit(function (editBuilder) {
			// 	editBuilder.replace(selection_1, replace);
			// });
		}
	});

	context.subscriptions.push(disposable4);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
