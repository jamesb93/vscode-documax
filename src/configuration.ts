import * as vscode from 'vscode';
import * as fs from 'fs';
import { getWorkspaceFolderUri, checkFileExistsInWorkspaceRoot } from './common';

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

class ConfigurationService {
	config: Configuration;
	configFileWatcher: vscode.FileSystemWatcher;
	constructor() {		
		this.configFileWatcher = vscode.workspace.createFileSystemWatcher('**/documax.config.json');
		this.config = this.initialiseConfiguration();
		this.createConfigurationWatchers();
	}
    
	createConfigurationWatchers = () => {
		this.configFileWatcher.onDidChange(() => { this.config = this.readConfigurationFile(); });
    	this.configFileWatcher.onDidCreate(() => { this.config = this.readConfigurationFile(); });
    	this.configFileWatcher.onDidDelete(() => { this.config = this.createDefaultConfiguration(); });
	}

	initialiseConfiguration = () => {
		// Determine if there is a configuration on extension init.
		const configExists = checkFileExistsInWorkspaceRoot('documax.config.json');
		if (configExists) {
			return this.readConfigurationFile();
		}
		return this.createDefaultConfiguration();
	}
	readConfigurationFile = (): Configuration => {
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
				return this.createDefaultConfiguration();
			}
		}
		return defaultConfiguation;
	}

	createDefaultConfiguration = (): Configuration => {
		return defaultConfiguation;
	}
	
}

export const configuration = new ConfigurationService();