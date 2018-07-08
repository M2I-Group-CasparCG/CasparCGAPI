"use strict";

class CasparProducer {

    constructor(settings){
        this.object='Producer';
        this.name = settings['name'] || 'Producer';
        this.type = "";
        this.id = 0;
        this.casparCommon = null;
        this.started = false;
    }

    getType(){
        return this.type;
    }
    getId(){
        return this.id;
    }
    start(){
        console.log('start function not yet developped for '+this.type);
    }

    stop(){
        console.log('stop function not yet developped for '+this.type);
    }

    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }
    getCasparCommon(){
        return this.casparCommon;
    }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getStarted(){return this.started;}
    setStarted(boolean){this.started = boolean;}


    tcpPromise(msg){ return this.casparCommon.tcpPromise(msg); }
}

module.exports = CasparProducer;