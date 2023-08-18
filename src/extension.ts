import * as vscode from 'vscode';
// @ts-ignore
import * as mustache from 'mustache';
import { ErrorCode, parse } from 'yaml';
import { max } from './templates/max';
import { render, sanitise } from './parsing';

function parseEditorContent(editorContent: string): string {
    try {
        const parsed = sanitise(parse(editorContent));
        mustache.escape = (text: string) => text;
        const rendered = mustache.render(max, parsed);
        return rendered;
    } catch(e: any) {
        return e.message;
    }

}

export function activate(context: vscode.ExtensionContext) {
    // Register a command to open the preview panel
    let disposable = vscode.commands.registerCommand('vscode-documax.previewDoc', () => {
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
            const preview: string = parseEditorContent(editor.document.getText());
            updateWebviewContent(panel, preview);

            // Listen for document changes
            const documentChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
                if (event.document === editor.document) {
                    const preview: string = parseEditorContent(editor.document.getText());
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

    context.subscriptions.push(disposable);
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
