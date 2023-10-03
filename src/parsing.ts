// @ts-nocheck
function insertDefaultData(source: Array<string>, key: string) {
    let temporary: Array<string>  = [];
	for (const [k, v] of Object.entries(source)) {
		v[key] = k;
		temporary.push(v);
	}
	return temporary;
}


export const sanitise = (data: Object) => {
    if (data.hasOwnProperty('messages')) {
        data.messages = insertDefaultData(data.messages, 'name');
    }
    if (data.hasOwnProperty('attributes')) {
        data.attributes = insertDefaultData(data.attributes, 'name');
    }
    if (data.hasOwnProperty('arguments')) {
        data.arguments = insertDefaultData(data.arguments, 'name');
    }
    if (data.hasOwnProperty('inlets')) {
        data.inlets = insertDefaultData(data.inlets, 'id');
    }
    if (data.hasOwnProperty('outlets')) {
        data.outlets = insertDefaultData(data.outlets, 'id');
    }
    return data;
};
