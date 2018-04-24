"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerNET extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.id = CasparProducer.totalInstances;
        this.name = settings['name'] || 'Stream';
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

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            case 'url' : {
                this.setUrl(value);
                response[setting] = this.getUrl();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
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