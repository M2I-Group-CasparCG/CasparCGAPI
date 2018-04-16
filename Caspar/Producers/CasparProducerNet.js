"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerNET extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.id = CasparProducer.totalInstances;
        this.url = settings['url'] || 'rtp://127.0.0.1:5004';        
        
    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.url}`;
        return this.tcpPromise(req);
    }

    stop(){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        return this.tcpPromise(req);
    }

    getId(){
        return this.id;
    }
    tcpPromise(msg){
        return this.casparCommon.tcpPromise(msg);
    }
}



module.exports = CasparProducerNET;