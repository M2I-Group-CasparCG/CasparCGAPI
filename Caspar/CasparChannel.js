"use strict";
var Consumer = require('./Consumers/CasparConsumer');
class CasparChannel {

    /**
     * Channel Constructor
     * @param {Array} settings  params
     *  ['name'] channel Name
     *  ['videoMode'] channel video Mode;
     */
    constructor(settings){
        CasparChannel.totalInstances = (CasparChannel.totalInstances || 0) + 1;
        this.id = settings['id'] || CasparChannel.totalInstances;
        this.name = settings['name'] || 'Channel';
        this.videoMode = settings['videoMode'] || null;
        this.consumers = new Map();
        this.consumersNb = 0;
        this.producers = new Map();
        this.casparCommon = null;
        this.backgroundLayer = 10;
        this.selectedInput = 0;
        this.state = settings['state'] || 'unknown';
        this.audioLevels = new Map();
    }


    /**
     * Permet de commuter la source d'un layer
     * @param {int} producerId producer to switch
     * @param {int} layer layer ID
     */
    switchLayer (producerId, layer = this.backgroundLayer) {
        var req = `PLAY ${this.id}-${this.backgroundLayer} route://${this.getCasparCommon().getMvId()}-${producerId}`;
        this.selectedInput = producerId;
        this.tcpSend(req,function(){});
    }

    addLayer () {

    }

    removeLayer () {

    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            case 'videoMode' : {
                this.setVideoMode(value);
                response[setting] = this.getVideoMode();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
            }
        }
        console.log(response);
        return response;
    }

    getName(){ return this.name; }
    setName(name){ this.name = name; }

    getVideoMode(){ return this.videoMode; }
    setVideoMode(videoMode){ this.videoMode = videoMode; }


    getConsumersNb(){ return this.consumersNb; }

    getId(){ return this.id; }

    getBackgroudLayer(){ return this.backgroundLayer; }

    tcpSend(msg, callback){ this.casparCommon.tcpSend(msg, callback); }

    setCasparCommon(casparCommon){ this.casparCommon = casparCommon; }
    getCasparCommon(){ return this.casparCommon; }

    

    setAudioLevel(channelNb, level){ this.audioLevels.set(channelNb, level); }
    getAudioLevels(){ return this.audioLevels; }
}

module.exports = CasparChannel;