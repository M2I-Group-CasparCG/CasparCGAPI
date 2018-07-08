"use strict";
var Consumer = require('./Consumers/CasparConsumer');
class CasparLayer {

    constructor(settings){

        CasparLayer.totalInstances = (CasparLayer.totalInstances || 0) + 1;
        this.object = 'Layer';
        this.id = CasparLayer.totalInstances;
        this.name = settings['name'] || 'layer';
        this.layerId = settings['layerId'] || 0;
        this.channelId = settings['channelId'] || 0;
        this.selectedInput = settings['layerId'] || 1;
        this.posX = settings['posX'] || 0;
        this.posY = settings['posY'] || 0;
        this.scaleX = settings['scaleX'] || 1;
        this.scaleY = settings['scaleY'] || 1;
        this.casparCommon = settings['casparCommon'] || null;
        this.started = false;
    }

    /**
     * Switch the input of a layer
     * @param {int} producerId id of the producer to set in the Layer
     * @return {Promise} tcpPromise
     */
    async setInput(producerId){
        // let req = `PLAY ${this.channelId}-${this.layerId} route://${this.getCasparCommon().getMvId()}-${producerId}`;
        this.selectedInput = producerId;
        let result = ["not started"];
        if (this.started){
            await this.start()
                .then(
                    function(resolve){
                       result = resolve;
                    },function(reject){
                        result = reject;
                    }
                )
        }
        return result;
    }

    /**
     * Start the play of the layer
     * @return {Promise} tcpPromise
     */
    async start(){
        let req = `PLAY ${this.channelId}-${this.layerId} route://${this.getCasparCommon().getMvId()}-${this.selectedInput}`;
        let layer = this;
        let result = []
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    layer.setStarted(true);
                    layer.getCasparCommon().sendSocketIo('layerEdit', layer);
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    /**
     * Stop the play of the layer
     * @return {Promise} tcpPromise
     */
    async stop(sendSocketIo = true){
        let req = `STOP ${this.channelId}-${this.layerId}`;
        let layer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    layer.setStarted(false);
                    if(sendSocketIo){
                        layer.getCasparCommon().sendSocketIo('layerEdit', layer);
                    }
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    /**
     * Update the mixer settings with the current layer instance properties
     * @return {Promise} tcpPromise
     */
    mixerFill(){
        let req = `MIXER ${this.channelId}-${this.layerId} FILL ${this.posX} ${this.posY} ${this.scaleX} ${this.scaleY}`;
        this.tcpPromise(req).then(function(){}, function(){}).catch(function(){});
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'layerId' : {
                this.setLayerId(value);
                response[setting] = this.getLayerId();
            }
            break;
            case 'producerId' : {
                this.setProducerId(value);
                response[setting] = this.getProducerId();
            }
            break;
            case 'channelId' : {
                this.setChannelId(value);
                response[setting] = this.getChannelId();
            }
            break;
            case 'posX' : {
                this.setPosX(value);
                response[setting] = this.getPosX();
            }
            break;
            case 'posY' : {
                this.setPosY(value);
                response[setting] = this.getPosY();
            }
            break;
            case 'scaleX' : {
                this.setScaleX(value);
                response[setting] = this.getScaleX();
            }
            break;
            case 'scaleY' : {
                this.setScaleY(value);
                response[setting] = this.getScaleY();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
        return response;
    }

    /**
     * GETTERS / SETTERS
     */

    getId() { return this.id; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getLayerId() { return this.layerId; }
    setLayerId(layerId) { this.layerId = layerId; }

    getProducerId() { return this.producerId; }
    setProducerId(producerId) { this.producerId = producerId; }

    getChannelId() { return this.channelId; }
    setChannelId(channelId) { this.channelId = channelId; }

    getPosX() { return this.posX; }
    setPosX(posX) { 
        this.posX = posX; 
        this.mixerFill(); }

    getPosY() { return this.posY; }
    setPosY(posY) { 
        this.posY = posY; 
        this.mixerFill(); }

    getScaleX() { return this.scaleX; }
    setScaleX(scaleX) { 
        this.scaleX = scaleX; 
        this.mixerFill(); }

    getScaleY() { return this.scaleY; }
    setScaleY(scaleY) { 
        this.scaleY = scaleY; 
        this.mixerFill(); }

    getCasparCommon() { return this.casparCommon; }
    setCasparCommon(casparCommon) { this.casparCommon = casparCommon; }

    tcpPromise(req) { return this.getCasparCommon().tcpPromise(req); }
    tcpSend(req, callback) { return this.getCasparCommon().tcpSend(req, callback); }

    setStarted(boolean){ this.started = boolean;}
    getStarted(){ return this.started; }

}


module.exports = CasparLayer;