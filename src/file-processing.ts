import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { parseAndRender } from './rendering';
// @ts-ignore
import { maxMustacheTemplate } from './templates/max';
import { configuration } from './configuration';


export function processFilesWithConfiguration() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const workspaceUri = workspaceFolders[0].uri;

        for (const [name, io] of Object.entries(configuration.getConfiguration())) {

            const outputFolderUri = vscode.Uri.joinPath(workspaceUri, io.output);

            const yamlFiles = vscode.workspace.findFiles(`${io.input}/**/*.yaml`, null, 4096);
            yamlFiles.then(files => {
                files.forEach(async file => {
                    const yamlDocument = await vscode.workspace.openTextDocument(file);
                    const yamlContent = yamlDocument.getText();

                    // Process the content using your logic
                    const processedContent = parseAndRender(yamlContent, maxMustacheTemplate);

                    // Determine the output path
                    const outputFileNameWithExtension = path.basename(file.fsPath, '.yaml') + '.maxref.xml';
                    const outputFileName = path.join(outputFolderUri.fsPath, outputFileNameWithExtension);

                    // Create the output folder if it doesn't exist
                    if (!fs.existsSync(outputFolderUri.fsPath)) {
                        fs.mkdirSync(outputFolderUri.fsPath);
                    }

                    // Write the processed content to the output file
                    fs.writeFileSync(outputFileName, processedContent);
                });
            });
            // vscode.window.showInformationMessage(`Processed all files using ${name} configuration`);
        }
    }
}