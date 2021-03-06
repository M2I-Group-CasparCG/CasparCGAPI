"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerSCREEN extends CasparConsumer {

    

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        super(settings);
        this.type = 'SCREEN';
        this.id = CasparConsumer.totalInstances;
        this.bufferDepth = settings['bufferDepth'] || 4;
        this.channelName = settings['channelName'] || 'Screen';
        this.channelId = settings['channelId'] || 0;
        this.fullscreen = settings['fullscreen'] || false;                        
    }


    async run() {
        var req = `ADD ${this.channelId} ${this.type} ${this.id} name ${this.name}-${this.channelName}`;
        if(this.fullscreen){
            req = `${req} FULLSCREEN`;
        }
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(true);
                    consumer.getCasparCommon().sendSocketIo('consumerEdit', consumer);
                   result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    async stop(sendSocketIo = true){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.id}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(false);
                    if(sendSocketIo){
                        consumer.getCasparCommon().sendSocketIo('consumerEdit', consumer);
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
            case 'channelName' : {
                this.setChannelName(value);
                response[setting] = this.getChannelName();
            }
            break; 
            default : {
                response[setting] = "not found";
            }
        }
        return response;
    }

    getChannelName(){ return this.channelName; }
    setChannelName(channelName){ this.channelName = channelName; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth(bufferDepth) { this.bufferDepth = bufferDepth; }

}

module.exports = CasparConsumerSCREEN;