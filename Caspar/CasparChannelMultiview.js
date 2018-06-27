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
    ini(producers){
        this.producers = producers || this.producers;
        console.log('mv ini');
        // ajout des sources au channel
        // et mise en place du mutliview
        if (this.producers.size == 1){
            var scale = 0.5;
        }else if (this.producers.size  <= 4){
            scale = 1/this.producers.size;
        }else{
            scale = 0.25;
        }
        // console.log('scale : '+scale)
        var posX = 0;
        if (this.producers.size <= 4){
            var posY = 0.5 + (0.5-scale)/2;
        }else{
            var posY = 0.5
        }
        
        var count = 0;
        var producerCount = 0;

        for(var key of this.producers.keys()){

           
                // console.log(producerCount);
                producerCount++;
                let req = `MIXER ${this.id}-${key} FILL ${scale*count} ${posY} ${scale} ${scale}`;
                // console.log(req);
                this.tcpSend(req, function(){});
                req = `MIXER ${this.id}-${key} VOLUME 0`;
                this.tcpSend(req, function(){});
                count++;

                if (count == 4 ){
                    var posY = 0.75
                    count = 0;
                }

        }

        // ajout de PGM / PVW
        let req = `PLAY ${this.id}-100 route://${this.getCasparCommon().getPgmId()}`;
        this.tcpSend(req, function(){}); 
        req = `MIXER ${this.id}-100 FILL 0.5 0 0.5 0.5`;
        this.tcpSend(req, function(){});
        req = `MIXER ${this.id}-100 VOLUME 1`;
        this.tcpSend(req, function(){});


        req = `PLAY ${this.id}-101 route://${this.getCasparCommon().getPvwId()}`;
        this.tcpSend(req, function(){});
        req = `MIXER ${this.id}-101 FILL 0 0 0.5 0.5`;
        this.tcpSend(req, function(){});
        req = `MIXER ${this.id}-101 VOLUME 0`;
        this.tcpSend(req, function(){});
    }

    tcpSend(msg, callback){
        this.casparCommon.tcpSend(msg,callback);
    }
}

module.exports = CasparChannelMultiview;