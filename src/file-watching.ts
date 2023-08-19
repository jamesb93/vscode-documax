import * as vscode from 'vscode';
import { processAndSaveAllFiles } from './file-processing';


export class FileWatcher {
    fileWatcher: vscode.FileSystemWatcher | null;
    isFileWatcherActive: boolean;
    statusBarItem: vscode.StatusBarItem | null;
    constructor() {
        this.fileWatcher = null;
        this.isFileWatcherActive = false;
        this.statusBarItem = null;
    }

    updateStatusBar = () => {
        if (this.statusBarItem) {
            this.statusBarItem.text = `File Watcher: ${this.isFileWatcherActive ? 'On' : 'Off'}`;
            this.statusBarItem.command = 'vscode-documax.toggleWatching';
            this.statusBarItem.show();
        }
    }

    toggleFileWatching = () => {
        console.log(this.statusBarItem);
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
            this.fileWatcher = null;
            this.isFileWatcherActive = false;
        } else {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.yaml');
                processAndSaveAllFiles();
                this.fileWatcher.onDidChange(() => {
                    if (this.isFileWatcherActive) {
                        processAndSaveAllFiles();
                    }
                });
                this.isFileWatcherActive = true;
            }
        }
    
        this.updateStatusBar();
    }
}



