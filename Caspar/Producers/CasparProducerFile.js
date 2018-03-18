"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerFILE extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.type = "FILE";
        this.id = CasparProducerFILE.totalInstances;
        this.fileName = settings['fileName'] || 'none';
        this.playMode = settings['playMode'] || 'loop';
        this.seek = settings['seek'] || false;
        this.start = settings['start'] || 0;
        this.length = settings['length'] || false;
        
    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.getFileName()} ${this.getPlayMode()}`;
        this.tcpSend(req, function(){});
    }
    stop(){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.tcpSend(req, function(){});
    }

    getId(){
        return this.id;
    }
    getFileName(){
        return this.fileName;
    }
    getPlayMode(){
        return this.playMode;
    }

    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg, callback);
    }

}



module.exports = CasparProducerFILE;