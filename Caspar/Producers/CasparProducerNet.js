"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerNET extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.type = 'NET';
        this.id = CasparProducer.totalInstances;
        this.name = settings['name'] || 'Stream';
        this.url = settings['url'] || 'rtp://127.0.0.1:5004';       
        
    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.url}`;
        let producer = this;
        this.tcpPromise(req)
            .then(
                function(resolve){  
                    producer.setStarted(true);
                    producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                    console.log(resolve);
                    return true;
                },function(reject){
                    console.log(reject);
                    return false;
                }
            )
    }

    stop(sendSocketIo = true){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        let producer = this;
        this.tcpPromise(req)
            .then(
                function(resolve){  
                    producer.setStarted(false);
                    if (sendSocketIo){
                        producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                    }
                    console.log(resolve);
                    return true;
                },function(reject){
                    console.log(reject);
                    return false;
                }
            )
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