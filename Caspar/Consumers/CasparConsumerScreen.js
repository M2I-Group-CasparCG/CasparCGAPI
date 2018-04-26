"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerSCREEN extends CasparConsumer {

    

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        super(settings);
        this.type = 'SCREEN';
        this.id = CasparConsumer.totalInstances;
        this.bufferDepth = settings['bufferDepth'] || 4;
        this.displayName = settings['displayName'] || 'Screen';
        this.channelId = settings['channelId'] || 0;
        
    }


    run() {
        var req = `ADD ${this.channelId} ${this.type} ${this.id} name ${this.displayName}`;
        return this.tcpPromise(req, function(){});
    }

    stop(){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.id}`;
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
            case 'displayName' : {
                this.setDisplayName(value);
                response[setting] = this.getDisplayName();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
            }
        }
        return response;
    }

    getDisplayName(){ return this.displayName; }
    setDisplayName(displayName){ this.displayName = displayName; }

    getBufferDepth() { return this.bufferDepth; }
    setBufferDepth(bufferDepth) { this.bufferDepth = bufferDepth; }

}

module.exports = CasparConsumerSCREEN;