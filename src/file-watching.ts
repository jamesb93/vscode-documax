import * as vscode from 'vscode';
import { processFilesWithConfiguration } from './file-processing';


class FileWatcher {
    fileWatcher: vscode.FileSystemWatcher | null;
    isFileWatcherActive: boolean;
    statusBarItem: vscode.StatusBarItem | null;
    constructor() {
        this.fileWatcher = null;
        this.isFileWatcherActive = false;
        this.statusBarItem = null;
        this.initialiseFileWatching();        
    }

    initialiseFileWatching = () => {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.updateStatusBar();
    };

    updateStatusBar = () => {
        if (this.statusBarItem) {
            this.statusBarItem.text = `File Watcher: ${this.isFileWatcherActive ? 'On' : 'Off'}`;
            this.statusBarItem.command = 'vscode-documax.toggleWatching';
            this.statusBarItem.show();
        }
    };

    toggleFileWatching = () => {
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
            this.fileWatcher = null;
            this.isFileWatcherActive = false;
        } else {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                this.fileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolders[0], '**/*.yaml'));
                processFilesWithConfiguration();
                this.fileWatcher.onDidChange(() => {
                    if (this.isFileWatcherActive) {
                        processFilesWithConfiguration();
                    }
                });
                this.isFileWatcherActive = true;
            }
        }
    
        this.updateStatusBar();
    };
}

export const yamlFileWatcher = new FileWatcher();



