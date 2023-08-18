// @ts-nocheck
import Mustache from 'mustache';
import { max } from './templates/max';

function insertDefaultData(source, key) {
    let temporary  = [];
    
	Object.entries(source).forEach(([k, v]) => {
        let temp = v;
        temp[key] = k;
        temporary.push(temp);
    });
    
	return temporary;
}


export const sanitise = (data) => {
    data.messages = insertDefaultData(data.messages, 'name');
	data.attributes = insertDefaultData(data.attributes, 'name');
	data.arguments = insertDefaultData(data.arguments, 'name');
	data.inlets = insertDefaultData(data.inlets, 'id');
	data.outlets = insertDefaultData(data.outlets, 'id');
    return data;
};


export const render = (json) => {
	return Mustache.render(max, json);
};