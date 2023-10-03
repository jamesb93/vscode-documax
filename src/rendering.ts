// @ts-ignore
const mustache = require('Mustache');
import { sanitise } from './parsing';
import { parse } from 'yaml';
import { marked } from 'marked';
import { objects, messages, attributes, links } from './markdownExtensions';


function parseEditorContent(editorContent: string): Object {
    const parsed = sanitise(parse(editorContent));
    return parsed;
}

function renderParsedContent(data: Object, template: string): string {
    try {
        mustache.escape = (text: string) => text;
        const rendered = mustache.render(template, data);
        return rendered;
    } catch(e: any) {
        return e.message;
    }
}

function recursiveObjectOperation(obj, callback) {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // If the value is an object, recursively call the function
            obj[key] = recursiveObjectOperation(obj[key], callback);
        } else {
            // If it's not an object, apply the callback function
            obj[key] = callback(key, obj[key]);
        }
    }
    return obj;
}

const renderer = {
    paragraph(text: string) {
        return `${text}\n`;
    }
};

marked.use({ renderer, extensions: [ objects, messages, attributes, links ] });

export function parseAndRender(editorContent: string, template: string): string {
    const parsed = parseEditorContent(editorContent);
    const markdownKeys = ['digest', 'digest']
    // TODO: this is where you would parse the text as markdown and convert it into HTML
    recursiveObjectOperation(parsed, (key: string, value: any) => {
        if (markdownKeys.includes(key)) {
            return marked.parse(value, { gfm: true });
        }
    }); 
    const rendered = renderParsedContent(parsed, template);
    return rendered;
}