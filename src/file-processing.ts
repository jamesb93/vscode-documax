import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parseAndRender } from './rendering';
// @ts-ignore
import { maxMustacheTemplate } from './templates/max';

export function processAndSaveAllFiles() {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        const workspaceUri = workspaceFolders[0].uri;
        const yamlFiles = vscode.workspace.findFiles('*.yaml', null, 4096); // Conceivably you won't be making more than 4096 objects. Why would you even try?

        yamlFiles.then(files => {
            files.forEach(async file => {
                const yamlDocument = await vscode.workspace.openTextDocument(file);
                const yamlContent = yamlDocument.getText();

                // Process the content using your logic
                const processedContent = parseAndRender(yamlContent, maxMustacheTemplate);

                // Determine the output path
                const outputFolderUri = vscode.Uri.joinPath(workspaceUri, 'documax-output');
                const outputFileNameWithExtension = path.basename(file.fsPath, '.yaml') + '.maxref.xml';
                const outputFileName = path.join(outputFolderUri.fsPath, outputFileNameWithExtension);

                // Create the output folder if it doesn't exist
                if (!fs.existsSync(outputFolderUri.fsPath)) {
                    fs.mkdirSync(outputFolderUri.fsPath);
                }

                // Write the processed content to the output file
                fs.writeFileSync(outputFileName, processedContent);
            });

            // Show a notification
            vscode.window.showInformationMessage(`Processed all YAML files and saved them to the documax-output folder.`);
        });
    }
}

export function processAndSaveFile() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        // Get the content of the active editor
        const editorContent = editor.document.getText();

        // Process the content using your logic
        const processedContent = parseAndRender(editorContent, maxMustacheTemplate);

        // Determine the output path (change 'output' to your desired folder name)
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const workspaceUri = workspaceFolders[0].uri;
            const outputFolderUri = vscode.Uri.joinPath(workspaceUri, 'documax-output');
            const activeDocumentFileName = path.basename(editor.document.fileName);
            const outputFileName = path.join(outputFolderUri.fsPath, activeDocumentFileName);
    
            // Create the output folder if it doesn't exist
            if (!fs.existsSync(outputFolderUri.fsPath)) {
                fs.mkdirSync(outputFolderUri.fsPath);
            }
    
    
            // Write the processed content to the output file
            fs.writeFileSync(outputFileName, processedContent);
    
            // Show a notification
            vscode.window.showInformationMessage(`Processed content saved to: ${outputFileName}`);
        }
    }
}