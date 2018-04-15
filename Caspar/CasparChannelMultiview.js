"use strict";
var Consumer = require('./Consumers/CasparConsumer');
var CasparChannel = require('./CasparChannel');

class CasparChannelMultiview extends CasparChannel{

    /**
     * Multiview Constructor
     * @param {Array} settings Mutliview Settings
     * @param {Map} producers Producers MAP to create the mutliview
     * ['patternId'] pattern to use to generate the mutliview
     */
    constructor(settings, producers){
        super(settings);
        this.id = settings['id'] || CasparChannel.totalInstances;
        this.casparCommon = null;
        this.patterId = settings['patternId'] || 0;
        this.producers = producers;
    }


    /** 
     * Initialize the mutliview according to the patternId
    */
    ini(){

        // ajout des sources au channel
        // et mise en place du mutliview
        var producerNb = this.producers.size;
        var scale = 0.333333;
        var posX = 0;
        var posY = 0.58;
        var count = 0;
        for(var key of this.producers.keys()){
            var producer = this.producers.get(key);
            var req = `MIXER ${this.id}-${producer.getId()} FILL ${scale*count} ${posY} ${scale} ${scale}`;
            this.tcpSend(req, function(){});
            var req = `MIXER ${this.id}-${producer.getId()} VOLUME 0`;
            this.tcpSend(req, function(){});
            count++;
        }

        // ajout de PGM / PVW
        req = `PLAY ${this.id}-100 route://${this.getCasparCommon().getPgmId()}`;
        this.tcpSend(req, function(){}); 
        req = `MIXER ${this.id}-100 FILL 0.5 0 0.5 0.5`;
        this.tcpSend(req, function(){});
        var req = `MIXER ${this.id}-100 VOLUME 1`;
        this.tcpSend(req, function(){});


        req = `PLAY ${this.id}-101 route://${this.getCasparCommon().getPvwId()}`;
        this.tcpSend(req, function(){});
        req = `MIXER ${this.id}-101 FILL 0 0 0.5 0.5`;
        this.tcpSend(req, function(){});
        var req = `MIXER ${this.id}-101 VOLUME 0`;
        this.tcpSend(req, function(){});
    }

    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg,callback);
    }

}

module.exports = CasparChannelMultiview;