"use strict";


class CasparConsumer {

    constructor(settings){
        this.object = 'Consumer';
        this.name = settings['name'] || 'Consumer';
        this.type = "";
        this.id = 0;
        this.channelId = settings['channelId'] || 0;
        this.started = false;
       
    }

    start(){

    }

    stop(){

    }


    getId(){ return this.id; }


    getCasparCommon(){ return this.casparCommon; }
    setCasparCommon(casparCommon){ this.casparCommon = casparCommon; }

    getChannelId(){ return this.channelId; }
    setChannelId(channelId){ 
        if(this.type != 'DECKLINK'){
            this.stop();
        }
        this.channelId = channelId; 

        this.run();
    }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    tcpSend(msg, callback){ this.getCasparCommon().tcpSend(msg, callback); }
    tcpPromise(msg){ return this.getCasparCommon().tcpPromise(msg); }

    setStarted(boolean){
        this.started = boolean;
    }
    getStarted(){
        return this.started;
    }
}

module.exports = CasparConsumer;