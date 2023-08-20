import * as vscode from 'vscode';
import * as fs from 'fs';
import { getWorkspaceFolderUri } from './common';

interface Configuration {
	[key: string]: {
		input: string;
		output: string;
	}
}

const defaultConfiguation: Configuration = {
	max : {
		input: 'sources',
		output: 'documax-output'
	}
};

export function readConfigurationFile(): Configuration {
	const workspaceUri = getWorkspaceFolderUri();
	if (workspaceUri) {
		const configPath = vscode.Uri.joinPath(
			workspaceUri,
			'documax.config.json'
		);
		try {
			const jsonContent = fs.readFileSync(configPath.fsPath, 'utf-8');
			const jsonData = JSON.parse(jsonContent);
			return jsonData;
		} catch (error) {
			console.error('Error reading or parsing JSON file:', error);
			return defaultConfiguation;
		}
	}
	return defaultConfiguation;
		


}
