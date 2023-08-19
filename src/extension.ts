import * as vscode from 'vscode';
import { processAndSaveAllFiles } from './file-processing';
import { previewFile } from './file-preview';

let fileWatcher: vscode.FileSystemWatcher | null = null;
let isFileWatcherActive = false;
let statusBar: vscode.StatusBarItem;

function updateStatusBar() {
    statusBar.text = `File Watcher: ${isFileWatcherActive ? 'On' : 'Off'}`;
    statusBar.command = 'vscode-documax.toggleWatching';
    statusBar.show();
}

function toggleFileWatching() {
    if (fileWatcher) {
        fileWatcher.dispose();
        fileWatcher = null;
        isFileWatcherActive = false;
    } else {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.yaml');
            fileWatcher.onDidChange(() => {
                if (isFileWatcherActive) {
                    processAndSaveAllFiles();
                }
            });
            isFileWatcherActive = true;
        }
    }

    updateStatusBar();
}

export function activate(context: vscode.ExtensionContext) {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    updateStatusBar();
    const previewDocumentCommand    = vscode.commands.registerCommand('vscode-documax.previewDoc', previewFile);
    const generateDocumentCommand   = vscode.commands.registerCommand('vscode-documax.generateDoc', processAndSaveAllFiles);
    const toggleFileWatchingCommand = vscode.commands.registerCommand('vscode-documax.toggleWatching', toggleFileWatching);

    context.subscriptions.push(previewDocumentCommand);
    context.subscriptions.push(generateDocumentCommand);
    context.subscriptions.push(toggleFileWatchingCommand);
}



