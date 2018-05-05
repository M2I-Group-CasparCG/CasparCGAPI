"use strict";
var Consumer = require('./Consumers/CasparConsumer');
var Layer = require('./CasparLayer');
class CasparChannel {

    /**
     * Channel Constructor
     * @param {Array} settings  params
     *  ['name'] channel Name
     *  ['videoMode'] channel video Mode;
     */
    constructor(settings){
        CasparChannel.totalInstances = (CasparChannel.totalInstances || 0) + 1;
        this.object = 'Channel'; 
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
        this.layers = new Map();
        this.lastLayerId = 20;          // début des layers à la couche 20. 
        this.state = new Array();        
    }


    /**
     * Permet de commuter la source d'un layer
     * @param {int} producerId producer to switch
     * @param {int} layer layer ID
     */
    setInput (producerId) {
        var req = `PLAY ${this.id}-${this.backgroundLayer} route://${this.getCasparCommon().getMvId()}-${producerId}`;
        this.selectedInput = producerId;
        return this.tcpPromise(req);
    }

    addLayer(layer) {
        layer.edit('layerId', this.lastLayerId++);
        this.layers.set(layer.getId(), layer);
        return layer;
    }

    removeLayer (layerId){ 

        if (this.layers.get(layerId) instanceof Layer){
            let layer = this.layers.get(layerId);
            layer.stop();
            this.layers.delete(layer.getId());
            return layer;
        }else{
            return false;
        }
    }

    getLayer (layerId){
        if (this.layers.get(layerId) instanceof Layer){
            return this.layers.get(layerId);
        }else{
            return false;
        }
    }

    getLayers (){
        return this.layers;
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'videoMode' : {
                this.setVideoMode(value);
                response[setting] = this.getVideoMode();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
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
    tcpPromise(msg){return this.casparCommon.tcpPromise(msg);}

    setCasparCommon(casparCommon){ this.casparCommon = casparCommon; }
    getCasparCommon(){ return this.casparCommon; } 

    setAudioLevel(channelNb, level){ this.audioLevels.set(channelNb, level); }
    getAudioLevels(){ return this.audioLevels; }
}

module.exports = CasparChannel;