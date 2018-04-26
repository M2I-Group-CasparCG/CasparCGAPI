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

    run() {
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.getFileName()} ${this.getPlayMode()}`;
        console.log(req);
        return this.tcpPromise(req);
    }

    stop(){
       
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        console.log(req);
        return this.tcpPromise(req);
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'fileName' : {
                this.setFileName(value);
                response[setting] = this.getFileName();
            }
            break;
            case 'playMode' : {
                this.setPlayMode(value);
                response[setting] = this.getPlayMode();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
            }
        }
        console.log(response);
        return response;
    }


    getId(){ return this.id; }

    getFileName(){ return this.fileName; }
    setFileName(fileName) { this.fileName = fileName; }

    getPlayMode(){ return this.playMode; }
    setPlayMode(playMode){ this.playMode = playMode; }


    

}



module.exports = CasparProducerFILE;