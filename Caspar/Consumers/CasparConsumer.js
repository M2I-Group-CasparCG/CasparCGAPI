"use strict";


class CasparConsumer {

    constructor(settings){
        this.name = settings['name'] || 'Consumer';
        this.id = 0;
        this.casparCommon = null;
        this.channelId = 0;
    }
    

    getName(){
        return this.name;
    }
    getId(){
        return this.id;
    }

    remove(){
        
    }
    getCasparCommon(){
        return this.casparCommon;
    }
    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }
    getChannelId(){
        return this.channelId;
    }
    setChannelId(channelId){
        this.channelId = channelId;
    }
}

module.exports = CasparConsumer;