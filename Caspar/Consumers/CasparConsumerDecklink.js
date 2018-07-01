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
        return this.tcpPromise(req);
    }

    stop(){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.decklinkId}`;
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
                response[setting] = "not found";
            }
        }
        return response;
    }



    getDecklinkId(){ return this.decklinkId; }
    setDecklinkId(decklinkId){ this.decklinkId = decklinkId; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth(bufferDepth) { this.bufferDepth = bufferDepth; }

    getLatency(){ return this.latency; }
    setLatency(latency){ this.latency = latency; }

    async setChannelId(id) {
        await this.stop()
            .then(
                function(resolve){
                    console.log(resolve);
                },
                function(reject){
                    console.log(reject);
                }
            )
        this.channelId = id;
        await  this.run()
        .then(
            function(resolve){
                console.log(resolve);
            },function(reject){
                console.log(reject);
            }
        )
       
    }

}

module.exports = CasparConsumerDECKLINK;