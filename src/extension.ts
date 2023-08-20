import * as vscode from 'vscode';
import { processAndSaveAllFiles } from './file-processing';
import { previewFile } from './file-preview';
import { FileWatcher } from './file-watching';
import { checkFileExistsInWorkspaceRoot } from './common';
import { readConfigurationFile } from './configuration';

let config = {
    
}

const configChange = () => {
    console.log('config change');
};

const configCreate = () => {
    console.log('config create')
};

const configDelete = () => {
    console.log('config delete')
};


export function activate(context: vscode.ExtensionContext) {
    const fileWatcher = new FileWatcher();
    fileWatcher.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    fileWatcher.updateStatusBar();

    const configExists = checkFileExistsInWorkspaceRoot('documax.config.json');
    if (configExists) {
        config = readConfigurationFile();
    }

    console.log(config);
    const configFileWatcher = vscode.workspace.createFileSystemWatcher('**/documax.config.json');
    configFileWatcher.onDidChange(configChange);
    configFileWatcher.onDidCreate(configCreate);
    configFileWatcher.onDidDelete(configDelete);

    const previewDocumentCommand    = vscode.commands.registerCommand('vscode-documax.previewDoc', previewFile);
    const generateDocumentCommand   = vscode.commands.registerCommand('vscode-documax.generateDoc', processAndSaveAllFiles);
    const toggleFileWatchingCommand = vscode.commands.registerCommand('vscode-documax.toggleWatching', fileWatcher.toggleFileWatching);

    context.subscriptions.push(previewDocumentCommand);
    context.subscriptions.push(generateDocumentCommand);
    context.subscriptions.push(toggleFileWatchingCommand);
}



