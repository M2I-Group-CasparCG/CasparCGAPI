"use strict";


class CasparConsumer {

    constructor(settings){
        this.object = 'Consumer';
        this.name = settings['name'] || 'Consumer';
        this.casparCommon = null;
        this.channelId = settings['channelId'] || 0;
    }

    start(){

    }

    stop(){

    }


    getId(){ return this.id; }


    getCasparCommon(){ return this.casparCommon; }
    setCasparCommon(casparCommon){ this.casparCommon = casparCommon; }

    getChannelId(){ return this.channelId; }
    setChannelId(channelId){ this.channelId = channelId; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    tcpSend(msg, callback){ this.getCasparCommon().tcpSend(msg, callback); }
    tcpPromise(msg){ return this.getCasparCommon().tcpPromise(msg); }
}

module.exports = CasparConsumer;