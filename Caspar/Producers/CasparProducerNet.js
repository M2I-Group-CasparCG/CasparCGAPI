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
        this.tcpSend(req, function(){});
    }

    stop(){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.tcpSend(req, function(){});
    }

    getId(){
        return this.id;
    }
    
    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg, callback);
    }
}



module.exports = CasparProducerNET;