// import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';

// const extension = vscode.extensions.getExtension('jamesbradbury.vscode-documax'); // Replace with your extension's ID

// if (extension) {
//   const templatePath = path.join(extension.extensionPath, 'src', 'templates', 'max.mustache');
  
//   try {
//     const templateString = fs.readFileSync(templatePath, 'utf8');
//     module.exports.maxMustacheTemplate = templateString;
//   } catch (err) {
//     console.error('Error reading template:', err);
//   }
// } else {
//   console.error('Extension not found.');
// }

export const maxMustacheTemplate = `
<?xml version='1.0' encoding='utf-8' standalone='yes'?>
<?xml-stylesheet href="./_c74_ref.xsl" type="text/xsl"?>

<c74object name='{{ name }}' category='{{ category }}' module='{{ module }}'>
    <digest>{{ digest }}</digest>
    <description>{{ description }}</description>
    <discussion>{{ discussion }}</discussion>

	<metadatalist>
		<metadata name='author'>{{ metadata.author }}</metadata>
        {{ #metadata.tags }}
		<metadata name='tag'>{{ . }}</metadata>
        {{ /metadata.tags }}
	</metadatalist>

    <!-- INLETS -->
    <inletlist>
        {{ #inlets }}
        <inlet id='{{ id }}' type='{{ type }}'>
            <digest>{{ digest }}</digest>
            <description>{{ description }}</description>
        </inlet>
        {{ /inlets }}
    </inletlist>
    <!-- INLETS -->

    <!-- OUTLETS -->
    <outletlist>
        {{ #outlets }}
        <outlet id='{{ id }}' type='{{ type }}'>
            <digest>{{ digest }}</digest>
            <description>{{ description }}</description>
        </outlet>
        {{ /outlets }}
    </outletlist>
    <!-- OUTLETS -->

    <!-- ARGUMENTS -->
    <objarglist>
    {{ #arguments }}
        <objarg name='{{ name }}' optional='{{ optional }}' type='{{ type }}'>
            <digest>{{ digest }}</digest>
            <description>{{ description }}</description>
        </objarg>
    {{ /arguments }}
    </objarglist>
    <!-- ARGUMENTS -->

    <!--MESSAGES-->
    <methodlist>
	{{ #messages }}
    <method name='{{ name }}'>
        <arglist>
            {{ #args}}
            <arg 
            name='{{ name }}' 
            optional='{{ optional }}' 
            type='{{ type }}' 
            units = '{{ units }}'
            />
            {{ /args }}
        </arglist>
        <digest>{{ digest }}</digest>
        <description>{{ description }}</description>
    </method>
	{{ /messages }}
	</methodlist>
	<!--MESSAGES-->

	<!--ATTRIBUTES-->
	<attributelist>
        {{ #attributes }}
        <attribute 
        name='{{ name }}' 
        type='{{ type }}' 
        size='{{ size }}'
        get='1' set='1' 
        >
        <digest>{{ digest }}</digest>
        <description>{{ description }}</description>

        <attributelist>
            <attribute 
            name='default' 
            type='{{ default.type }}' 
            size='{{ default.size }}' 
            value='{{ default.value }}'
            get='1' set='1' 
            />
        </attributelist>
        </attribute>
        {{ /attributes }}
	</attributelist>
	<!--ATTRIBUTES-->

	<!-- SEEALSO -->
	<seealsolist>
        {{ #seealso }}
        <seealso name='{{ . }}' />
        {{ /seealso }}
	</seealsolist>
	<!-- SEEALSO -->
</c74object>
`;