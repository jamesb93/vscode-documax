export const objects = {
    name: 'maxObject',
    level: 'inline',
    start(src: string) { 
        const index = src.indexOf('$');
        if (index !== -1) {
            return index;
        }
    },
    tokenizer(src: string, tokens: Array<any>) {
        const rule = /^\$([^}]+)\$/;
        const match = rule.exec(src);
        if (match) {
            const token = {
                type: 'maxObject',
                raw: match[0],
                text: match[1].trim(),
                tokens: []
            };
            this.lexer.inline(token.text, token.tokens)
            return token;
        }
    },
    renderer(token: any) {
        return `<o>${token.text}</o>`;
    }
};

export const messages = {
    name: 'maxMessages',
    level: 'inline',
    start(src: string) { 
        const index = src.indexOf('!');
        if (index !== -1) {
            return index;
        }
    },
    tokenizer(src: string, tokens: Array<any>) {
        const rule = /^!([^}]+)!/;
        const match = rule.exec(src);
        if (match) {
            const token = {
                type: 'maxMessages',
                raw: match[0],
                text: match[1].trim(),
                tokens: []
            };
            this.lexer.inline(token.text, token.tokens)
            return token;
        }
    },
    renderer(token: any) {
        return `<m>${token.text}</m>`;
    }
};

export const attributes = {
    name: 'maxAttributes',
    level: 'inline',
    start(src: string) { 
        const index = src.indexOf('@');
        if (index !== -1) {
            return index;
        }
    },
    tokenizer(src: string, tokens: Array<any>) {
		// regex to capture everything inside of @@
		const rule = /^@([^@]+)@/;
		const match = rule.exec(src);
        if (match) {
            const token = {
                type: 'maxAttributes',
                raw: match[0],
                text: match[1].trim(),
                tokens: []
            };
            this.lexer.inline(token.text, token.tokens)
            return token;
        }
    },
    renderer(token: any) {
        return `<at>${token.text}</at>`;
    }
};

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
            this.lexer.inline(token.text, token.tokens)
            return token;
        }
    },
    renderer(token: any) {
		const linkData = token.tokens[0];
		return `<openfilelink filename=${linkData.url}>${linkData.text}</openfilelink>`;
    }
};
