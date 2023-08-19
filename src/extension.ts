import * as vscode from 'vscode';
import { processAndSaveAllFiles } from './file-processing';
import { previewFile } from './file-preview';
import { FileWatcher } from './file-watching';


export function activate(context: vscode.ExtensionContext) {
    const fileWatcher = new FileWatcher();
    fileWatcher.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    fileWatcher.updateStatusBar();

    const previewDocumentCommand    = vscode.commands.registerCommand('vscode-documax.previewDoc', previewFile);
    const generateDocumentCommand   = vscode.commands.registerCommand('vscode-documax.generateDoc', processAndSaveAllFiles);
    const toggleFileWatchingCommand = vscode.commands.registerCommand('vscode-documax.toggleWatching', fileWatcher.toggleFileWatching);

    context.subscriptions.push(previewDocumentCommand);
    context.subscriptions.push(generateDocumentCommand);
    context.subscriptions.push(toggleFileWatchingCommand);
}



