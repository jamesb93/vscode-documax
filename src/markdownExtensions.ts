const createParserToken = (name: string, shortDecorator: string, longDecorator: string, xmlElement: string) => {
    const token = {
        name: name,
        level: 'inline',
        start(src: string) {
            const regex = new RegExp(`${longDecorator}|${shortDecorator}`);
            const match = src.match(regex);
            return match?.index;
        },
        tokenizer(src: string, tokens: Array<any>) {
            const regex = new RegExp(`^(?:${longDecorator}|${shortDecorator})\\s+(\\w+(?:\\.\\w+)*)`);
            const match = src.match(regex);
            if (match) {
                const token = {
                    type: name,
                    raw: match[0],
                    text: match[1].trim(),
                    tokens: []
                };
                this.lexer.inline(token.text, token.tokens);
                return token;
            }
        },
        renderer(token: any) {
            return `<${xmlElement}>${token.text}</${xmlElement}>`;
        }
    };
    return token;
};

export const objects = createParserToken('maxObject', '@o', '@object', 'o');
export const messages = createParserToken('maxMessages', '@m', '@message', 'm');
export const attributes = createParserToken('maxAttributes', '@a', '@attribute', 'at');
export const links = {
    name: 'maxLinks',
    level: 'inline',
    start(src: string) { 
        const index = src.indexOf('{');
        if (index !== -1) {
            return index;
        }
    },
    tokenizer(src: string, tokens: Array<any>) {
        const rule = /^\{([^}]+)\}\(([^)]+)\)/;
        const match = rule.exec(src);
        if (match) {
            const token = {
                type: 'maxLinks',
                raw: match[0],
                text: match[1].trim(),
                tokens: [{
                    url: match[2].trim(),
                    text: match[1].trim()
                }]
            };
            this.lexer.inline(token.text, token.tokens);
            return token;
        }
    },
    renderer(token: any) {
        const linkData = token.tokens[0];
        return `<openfilelink filename=${linkData.url}>${linkData.text}</openfilelink>`;
    }
};
