"use strict";

class CasparProducer {

    constructor(settings){
        this.name = settings['name'] || 'Producer';
        this.type = "";
        this.id = 0;
        this.casparCommon = null;
    }

    getType(){
        return this.type;
    }
    getId(){
        return this.id;
    }
    start(){
        console.log('start');
    }

    remove(){
        console.log('remove');
    }

    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }
}

module.exports = CasparProducer;