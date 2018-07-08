"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerFILE extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.type = "FILE";
        this.id = CasparProducer.totalInstances;
        this.fileName = settings['fileName'] || 'none';
        this.playMode = settings['playMode'] || 'loop';
        this.seek = settings['seek'] || false;
        this.start = settings['start'] || 0;
        this.length = settings['length'] || false;
        
    }

    async run() {
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.getFileName()} ${this.getPlayMode()}`;
        let producer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    result.push(resolve);
                    producer.setStarted(true);
                    producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    async stop(sendSocketIo = true){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        let producer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    producer.setStarted(false);
                    if(sendSocketIo){
                        producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                    }
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
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
                response[setting] = "not found";
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