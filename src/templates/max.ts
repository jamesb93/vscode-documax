import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const extension = vscode.extensions.getExtension('jamesbradbury.vscode-documax'); // Replace with your extension's ID

if (extension) {
  const templatePath = path.join(extension.extensionPath, 'src', 'templates', 'max.mustache');
  
  try {
    const templateString = fs.readFileSync(templatePath, 'utf8');
    module.exports.maxMustacheTemplate = templateString;
  } catch (err) {
    console.error('Error reading template:', err);
  }
} else {
  console.error('Extension not found.');
}
