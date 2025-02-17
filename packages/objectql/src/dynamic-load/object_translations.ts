import { getSteedosSchema } from '../types/schema';
import path = require('path');
import * as _ from 'underscore';
var util = require('../util');

const brokeEmitEvents = async(filePath)=>{
    let schema = getSteedosSchema();
    await schema.broker?.emit(`translations.object.change`, {
        filePath
    });
}

const addObjectsTranslation = async (objectApiName, data)=>{
    return await getSteedosSchema().metadataBroker?.call('translations.addObjectTranslation', {
        objectApiName, data
    })
}

export const addObjectTranslationsFiles = async (filePath: string)=>{
    if(!path.isAbsolute(filePath)){
        throw new Error(`${filePath} must be an absolute path`);
    }

    let objectTranslations = util.loadObjectTranslations(filePath)
    for (const element of objectTranslations) {
        try {
            await addObjectsTranslation(element.objectApiName, element)
        } catch (error) {
            console.error(`addObjectsTranslation error`, error.message)
        }
    }
    await brokeEmitEvents(filePath)
}

export const getObjectTranslations = async ()=>{
    const metadataObjectTranslations = await getSteedosSchema().metadataBroker.call('translations.getObjectTranslations')
    return _.pluck(metadataObjectTranslations, 'metadata')
}   