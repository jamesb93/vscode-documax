# vscode-documax

vscode-documax is an extension for Visual Studio Code that allows you to transform YAML files as structured data into [Max]() reference files. It offers a few bells and whistles to make this process simple, such as:
- XML output preview
- Rendered preview (in progres...)
- Input and ouput configurations for complex projects
- Flexible mustache template rendering for bespoke purposes.

## How do I use it?

Install the extension! That's it for the first part. 

### Configuration
Create a configuration, or don't. Here is how the extension works if you DON'T make a configuration. It reads all YAML files in a folder named `sources and will render and output them (presuming no errors in the YAML) to a folder named `docs`.

Read more about the configuration below in the next section.

### Commands
Documax exposes three commands:

`Documax: Preview Output`

While a valid YAML file is open in the editor, triggering `Documax: Preview Output` will show a preview (or any errors from parsing the input) in a webview pane.

`Documax: Generate Output`

The extension will first read your configuration, and then process each configuration as follows. This is a "batch" process.

`Documax: Toggle File Watching`

This configures a status toggle by which if any changes are detected to the workspace, it will retrigger the batch process of generating outputs. Useful for seeing the output as you edit and for working iteratively.

## Configuration Schema



A configuration is a `.json` file stored in the root of a workspace folder with the name `documax.config.json`.

This file defines a series of configurations that the extension will use to process an input folder and delivers the results to an output folder.

If this is too abstract, a basic configuration will look like this:

```json
{
	"max" : {
		"input" : "my_yaml_files_folder",
		"output" : "output_folder"
	}
}
```

Everytime you generate an output, either via the automatic file watching, or a manual generation all of the `.yaml` files inside `my_yaml_files_folder` will be processed and the outputs will be rendered to `output_folder`. What is potentially useful about configurations is you can combine as many as you need and the extension will "multiplex" them. So this is a total valid configuration too:

```json
{
	"package1" : {
		"input" : "project_yaml_1",
		"output" : "output_folder_1"
	},
	"package2" : {
		"input" : "project_yaml_2",
		"output": "output_folder_2"
	}
}
```


