"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerSCREEN extends CasparConsumer {

    

    constructor(settings){
        CasparConsumerSCREEN.totalInstances = (CasparConsumerSCREEN.totalInstances || 0) + 1;
        super(settings);
        this.type = 'SCREEN';
        this.id = CasparConsumerSCREEN.totalInstances;
        this.bufferDepth = settings['bufferDepth'] || 4;
        this.diplayName = settings['displayName'] || 'Screen';
        this.id = CasparConsumerSCREEN.totalInstances;
        this.channelId = settings['channelId'] || 0;
        
    }


    run() {
        var req = `ADD ${this.channelId} ${this.type} ${this.id} name ${this.diplayName}`;
        this.tcpSend(req, function(){});
    }

    stop(){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.id}`;
        this.tcpSend(req, function(){});
    }
    
    tcpSend(msg, callback){
        this.getCasparCommon().tcpSend(msg, callback);
    }

    setDisplayName(channelName){
        this.displayName = channelName;
    }
}

module.exports = CasparConsumerSCREEN;