import * as vscode from 'vscode';
import { processAndSaveAllFiles } from './file-processing';
import { previewFile } from './file-preview';
import { yamlFileWatcher } from './file-watching';

export function activate(context: vscode.ExtensionContext) {
    const previewDocumentCommand        = vscode.commands.registerCommand('vscode-documax.previewDoc', previewFile);
    const generateDocumentCommand       = vscode.commands.registerCommand('vscode-documax.generateDoc', processAndSaveAllFiles);
    const toggleFileWatchingCommand     = vscode.commands.registerCommand('vscode-documax.toggleWatching', yamlFileWatcher.toggleFileWatching);
    // TODO: const generateAllDocumentsCommand   = vscode.commands.registerCommand('vscode-documax.generateAllDoc', processAndSaveAllFiles);

    context.subscriptions.push(previewDocumentCommand);
    context.subscriptions.push(generateDocumentCommand);
    context.subscriptions.push(toggleFileWatchingCommand);
}



