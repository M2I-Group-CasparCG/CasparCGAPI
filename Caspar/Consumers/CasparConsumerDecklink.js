"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerDECKLINK extends CasparConsumer {

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        super(settings);
        this.type = 'DECKLINK';
        this.id = CasparConsumer.totalInstances;
        this.decklinkId = settings['decklinkId'] || 1;
        this.bufferDepth = settings['bufferDepth'] || 5;
        this.latency = settings['latency'] || 'default';
        
    }


    run(){
        var req = `ADD ${this.channelId} ${this.type} ${this.decklinkId}`;
        return this.tcpPromise(req, function(){});
    }

    stop(){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.decklinkId}`;
        return this.tcpPromise(req, function(){});
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'bufferDepth' : {
                this.setBufferDepth(value);
                response[setting] = this.getBufferDepth();
            }
            break;
            case 'channelId' : {
                this.setChannelId(value);
                response[setting] = this.getChannelId();
            }
            break;
            case 'decklinkId' : {
                this.setDecklinkId(value);
                response[setting] = this.getDecklinkId();
            }
            break;
            case 'latency' : {
                this.setLatency(value);
                response[setting] = this.getLatency();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
            }
        }
        return response;
    }



    getDecklinkId(){ return this.decklinkId; }
    setDecklinkId(decklinkId){ this.decklinkId = decklinkId; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth() { this.bufferDepth = this.bufferDepth; }

    getLatency(){ return this.latency; }
    setLatency(latency){ this.latency = latency; }

}

module.exports = CasparConsumerDECKLINK;