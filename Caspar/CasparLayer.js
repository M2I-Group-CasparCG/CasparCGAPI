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
                    layer.getCasparCommon().getSocketIo().emit('layerEdit', layer.clean());
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
                        layer.getCasparCommon().getSocketIo().emit('layerEdit', layer.clean());
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

    edit(settings){

        let result = new Object();
            result['channelId'] = this.getId();

        for (let [setting, value] of Object.entries(settings)) {
            switch (setting){
                case 'name' : {
                    this.setName(value);
                    result[setting] = this.getName();
                }
                break;
                case 'layerId' : {
                    this.setLayerId(value);
                    result[setting] = this.getLayerId();
                }
                break;
                case 'producerId' : {
                    this.setProducerId(value);
                    result[setting] = this.getProducerId();
                }
                break;
                case 'channelId' : {
                    this.setChannelId(value);
                    result[setting] = this.getChannelId();
                }
                break;
                case 'posX' : {
                    this.setPosX(value);
                    result[setting] = this.getPosX();
                }
                break;
                case 'posY' : {
                    this.setPosY(value);
                    result[setting] = this.getPosY();
                }
                break;
                case 'scaleX' : {
                    this.setScaleX(value);
                    result[setting] = this.getScaleX();
                }
                break;
                case 'scaleY' : {
                    this.setScaleY(value);
                    result[setting] = this.getScaleY();
                }
                break;
                default : {
                    result[setting] = "not found";
                }
            }
        }
        return result;
    }

    clean () {
        const copy = Object.assign({}, this);
        copy.casparCommon = copy.casparCommon.clean();
        return copy;
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