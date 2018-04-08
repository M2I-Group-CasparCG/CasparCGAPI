"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerDECKLINK extends CasparProducer{

    constructor(settings, casparCommon){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings, casparCommon);
        this.decklinkNb = settings['decklinkNb'] || 0;
        this.casparCommon = casparCommon;
        this.id = CasparProducer.totalInstances;
    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} DECKLINK ${this.decklinkNb}`;
        this.tcpSend(req, function(){});
    }

    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg, callback);
    }

}



module.exports = CasparProducerDECKLINK;