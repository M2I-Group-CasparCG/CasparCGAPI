"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerDECKLINK extends CasparConsumer {

    constructor(settings){
       
        super(settings);
        this.type = 'DECKLINK';
        this.decklinkId = settings['decklinkId'] || 1;
        this.bufferDepth = settings['bufferDepth'] || 5;
        this.latency = settings['latency'] || 'default';
    }


    async run(){
        super.run();
        var req = `ADD ${this.channelId} ${this.type} ${this.decklinkId}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(true);
                    consumer.getCasparCommon().getSocketIo().emit('consumerEdit', consumer.clean());
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    async stop(sendSocketIo = true){
        super.stop();
        var req = `REMOVE ${this.channelId} ${this.type} ${this.decklinkId}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(false);
                    if(sendSocketIo){
                        consumer.getCasparCommon().getSocketIo().emit('consumerEdit', consumer.clean());
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
                case 'decklinkId' : {
                    this.setDecklinkId(value);
                    result[setting] = this.getDecklinkId();
                }
                break;
                case 'latency' : {
                    this.setLatency(value);
                    result[setting] = this.getLatency();
                }
                break;
                default : {
                    result[setting] = "not found";
                }
            }
        }
        return result;
    }


    getDecklinkId(){ return this.decklinkId; }
    setDecklinkId(decklinkId){ this.decklinkId = decklinkId; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth(bufferDepth) { this.bufferDepth = bufferDepth; }

    getLatency(){ return this.latency; }
    setLatency(latency){ this.latency = latency; }

    async setChannelId(id) {

        let  result1 = await this.stop();
        this.channelId = id; 
        let  result2 =await  this.run();
        return result1.concat(result2);
       
    }

}

module.exports = CasparConsumerDECKLINK;