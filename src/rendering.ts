// @ts-ignore
const mustache = require('Mustache');
import { load } from 'js-yaml';
import { marked } from 'marked';
import { sanitise } from './parsing';
import { objects, messages, attributes, links } from './markdownExtensions';


function recursiveObjectOperation(obj: any, callback: (key: string, value: any) => any) {
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

function parseEditorContent(editorContent: string): Object {
    const parsed = load(editorContent);
    return sanitise(parsed);
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

export function parseAndRender(editorContent: string, template: string): string {
    const markdownKeys = ['digest', 'discussion', 'description'];

    const parsedEditorContent = parseEditorContent(editorContent);
    recursiveObjectOperation(parsedEditorContent, (key: string, value: any) => {
        if (markdownKeys.includes(key)) {
            return marked.parse(value, { gfm: true });
        }
        return value;
    });
    const rendered = renderParsedContent(parsedEditorContent, template).trim();
    return rendered;
}
