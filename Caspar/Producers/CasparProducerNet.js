"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerNET extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.type = 'NET';
        this.id = CasparProducer.totalInstances;
        this.name = settings['name'] || 'Stream';
        this.url = settings['url'] || 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov';       
        
    }

    async run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.url}`;
        let producer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    producer.setStarted(true);
                    producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                    result.push(resolve);
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
                    if (sendSocketIo){
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
            case 'url' : {
                this.setUrl(value);
                response[setting] = this.getUrl();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
        return response;
    }

    getId(){ return this.id; }

    getName () { return this.name; }
    setName (name) { this.name = name; }

    getUrl () { return this.url; }
    setUrl (url) { this.url = url; }



}



module.exports = CasparProducerNET;