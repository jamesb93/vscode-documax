import * as vscode from 'vscode';
// @ts-ignore
import { maxMustacheTemplate } from './templates/max';
import { parseAndRender } from './rendering';

export function previewFile() {
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
