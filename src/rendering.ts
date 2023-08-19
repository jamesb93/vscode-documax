// @ts-ignore
import * as mustache from 'mustache';
import { sanitise } from './parsing';
import { parse } from 'yaml';


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

export function parseAndRender(editorContent: string, template: string): string {
	const parsed = parseEditorContent(editorContent);
	const rendered = renderParsedContent(parsed, template);
	return rendered;
}