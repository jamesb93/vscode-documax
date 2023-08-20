import * as vscode from 'vscode';

export function getWorkspaceFolderUri(): vscode.Uri | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        // Return the URI of the first workspace folder
        return workspaceFolders[0].uri;
    }
    return undefined; // No workspace folders
}

export function checkFileExistsInWorkspaceRoot(filePath: string): boolean {
    try {
        const workspaceFolder = getWorkspaceFolderUri();
        if (workspaceFolder) {
            const configPath = vscode.Uri.joinPath(workspaceFolder, filePath);
            vscode.workspace.fs.stat(configPath);
            return true; // File exists
        } else {
            return false;
        }
    } catch (error) {
        return false; // File does not exist
    }
}
