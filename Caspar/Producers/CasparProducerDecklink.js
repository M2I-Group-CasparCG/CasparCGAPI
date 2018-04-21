"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerDECKLINK extends CasparProducer{

    constructor(settings, casparCommon){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings, casparCommon);
        this.type = 'DECKLINK';
        this.decklinkId = settings['decklinkId'] || 0;
        this.casparCommon = casparCommon;
        this.id = CasparProducer.totalInstances;
    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} DECKLINK ${this.decklinkId}`;
        console.log(req);
        return this.tcpPromise(req, function(){});
    }

    stop(){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()} DECKLINK ${this.decklinkId}`;
        return this.tcpPromise(req, function(){});
    }

    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg, callback);
    }

}



module.exports = CasparProducerDECKLINK;