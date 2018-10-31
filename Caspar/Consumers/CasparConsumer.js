"use strict";

const utils     = require('../../utils.js');

class CasparConsumer {

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        this.id                 = CasparConsumer.totalInstances;
        this.object             = 'Consumer';
        this.type               = null;
        this.channelId          = settings['channelId'] || 0;
        this.casparCommon       = null;
        this.name               = settings['name'] || `consumer-${this.id}`;       
        this.started            = false;
    }

    run(){
        utils.debug('yellow',`Running ${this.object} - "${this.name}" - id : ${this.id}`)
    }

    stop(){
        utils.debug('yellow',`Stopping ${this.object} - "${this.name}" - id : ${this.id}`)
    }

    /**
     * @return the current object cleaned from circular reference 
     */
    clean(){
        const copy = Object.assign({}, this);
        copy.casparCommon = copy.casparCommon.clean();
        return copy;
    }



    getId(){ return this.id; }
    getType() { return this.type;}

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

    setStarted(boolean){ this.started = boolean; }
    getStarted(){ return this.started; }

    tcpPromise(msg){ return this.getCasparCommon().tcpPromise(msg); }


}

module.exports = CasparConsumer;