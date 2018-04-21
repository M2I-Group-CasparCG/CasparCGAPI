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

    getName() { return this.name; }
    setName(name) { this.name = name; }

    tcpPromise(msg){ return this.casparCommon.tcpPromise(msg); }
}

module.exports = CasparProducer;