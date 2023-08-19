// @ts-nocheck
function insertDefaultData(source: Array<string>, key: string) {
    let temporary: Array<string>  = [];
    
	Object.entries(source).forEach(([k, v]) => {
        v[key] = k;
        temporary.push(v);
    });
    
	return temporary;
}


export const sanitise = (data: Object) => {
    data.messages = insertDefaultData(data.messages, 'name');
	data.attributes = insertDefaultData(data.attributes, 'name');
	data.arguments = insertDefaultData(data.arguments, 'name');
	data.inlets = insertDefaultData(data.inlets, 'id');
	data.outlets = insertDefaultData(data.outlets, 'id');
    return data;
};