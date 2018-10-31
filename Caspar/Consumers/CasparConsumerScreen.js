"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerSCREEN extends CasparConsumer {

    

    constructor(settings){
        super(settings);
        this.type = 'SCREEN';
        this.bufferDepth = settings['bufferDepth'] || 4;
        this.channelName = settings['channelName'] || 'Screen';
        this.fullscreen = settings['fullscreen'] || false;                        
    }


    async run() {
        super.run();
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
        super.stop();
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

    edit(settings){

        let result = new Object();
            result['consumerId'] = this.getId();
            
        for (let [setting, value] of Object.entries(settings)) {
            switch (setting){
                case 'name' : {
                    this.setName(value);
                    result[setting] = this.getName();
                }
                break;
                case 'bufferDepth' : {
                    this.setBufferDepth(value);
                    result[setting] = this.getBufferDepth();
                }
                break;
                case 'channelId' : {
                    this.setChannelId(value);
                    result[setting] = this.getChannelId();
                }
                break;
                case 'channelName' : {
                    this.setChannelName(value);
                    result[setting] = this.getChannelName();
                }
                break; 
                default : {
                    result[setting] = "not found";
                }
            }
        }
        return result;
    }

    getChannelName(){ return this.channelName; }
    setChannelName(channelName){ this.channelName = channelName; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth(bufferDepth) { this.bufferDepth = bufferDepth; }

}

module.exports = CasparConsumerSCREEN;