import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { parseAndRender } from './rendering';
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

export function activate(context: vscode.ExtensionContext) {
    // Register a command to open the preview panel
    let previewDocumentCommand = vscode.commands.registerCommand('vscode-documax.previewDoc', () => {
        // Create a webview panel
        const panel = vscode.window.createWebviewPanel(
            'previewPanel',
            'Documax Output Preview',
            vscode.ViewColumn.Two,
            {}
        );

        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        
        if (editor) {
            // Update the webview content with initial character count
            const preview: string = parseAndRender(editor.document.getText(), maxMustacheTemplate);
            updateWebviewContent(panel, preview);

            // Listen for document changes
            const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
                if (event.document === editor.document) {
                    const preview: string = parseAndRender(editor.document.getText(), maxMustacheTemplate);
                    // Update the webview content with new character count
                    updateWebviewContent(panel, preview);
                }
            });

            // Dispose the document change listener when the panel is closed
            panel.onDidDispose(() => {
                documentChangeDisposable.dispose();
            });
        }
    });

    let generateDocumentCommand = vscode.commands.registerCommand('vscode-documax.generateDoc', processAndSaveAllFiles);

    context.subscriptions.push(previewDocumentCommand);
    context.subscriptions.push(generateDocumentCommand);
}

function updateWebviewContent(panel: vscode.WebviewPanel, content: string) {
    const escapedContent = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    panel.webview.html = `<pre>${escapedContent}</pre>`;
}
