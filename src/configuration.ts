import * as vscode from 'vscode';
import * as fs from 'fs';
import { yamlFileWatcher } from './file-watching';
import { getWorkspaceFolderUri, checkFileExistsInWorkspaceRoot } from './common';
import { processFilesWithConfiguration } from './file-processing';


export interface ConfigurationIO {
	input: string,
	output: string
}

export interface Configuration {
	[key: string]: ConfigurationIO
}

const defaultConfiguation: Configuration = {
	default : {
		input: 'sources',
		output: 'docs'
	}
};

class ConfigurationService {
	config: Configuration;
	configFileWatcher: vscode.FileSystemWatcher;
	constructor() {		
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders) {
			this.configFileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolders[0], '**/documax.config.json'));
		} else {
			this.configFileWatcher = vscode.workspace.createFileSystemWatcher('**/documax.config.json');
		}
		this.config = this.initialiseConfiguration();
		this.createConfigurationWatchers();
	}
    
	createConfigurationWatchers = () => {
		this.configFileWatcher.onDidChange(() => { 
			this.config = this.readConfigurationFile(); 
			if (yamlFileWatcher.isFileWatcherActive) {
				processFilesWithConfiguration();
			}
		});
    	this.configFileWatcher.onDidCreate(() => { 
			this.config = this.readConfigurationFile();
			if (yamlFileWatcher.isFileWatcherActive) {
				processFilesWithConfiguration();
			}
		});
    	this.configFileWatcher.onDidDelete(() => { 
			this.config = this.createDefaultConfiguration();
			if (yamlFileWatcher.isFileWatcherActive) {
				processFilesWithConfiguration();
			} 
		});
	};

	initialiseConfiguration = () => {
		// Determine if there is a configuration on extension init.
		const configExists = checkFileExistsInWorkspaceRoot('documax.config.json');
		if (configExists) {
			return this.readConfigurationFile();
		}
		return this.createDefaultConfiguration();
	};

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
				this.validateConfiguration();
				return jsonData;
			} catch (error) {
				return this.createDefaultConfiguration();
			}
		}
		return defaultConfiguation;
	};

	validateConfiguration = () => {
		for (const [name, io] of Object.entries(this.getConfiguration())) {
			if (!io.hasOwnProperty('input')) {
				const err = `Configuration ${name} has invalid input.`;
				vscode.window.showErrorMessage(err);
				throw new Error(err);
			}

			if (!io.hasOwnProperty('output')) {
				const err = `Configuration ${name} has invalid output.`;
				vscode.window.showErrorMessage(err);
				throw new Error(err);
			}
		}
	};

	createDefaultConfiguration = (): Configuration => {
		return defaultConfiguation;
	};

	getConfiguration = (): Configuration => {
		return this.config;
	};
}

export const configuration = new ConfigurationService();