"use strict";
var Consumer = require('./Consumers/CasparConsumer');
class CasparLayer {

    constructor(settings){

        CasparLayer.totalInstances = (CasparLayer.totalInstances || 0) + 1;
        this.id = CasparLayer.totalInstances;
        this.name = settings['name'] || 'layer';
        this.layerId = settings['layerId'] || 0;
        this.channelId = settings['channelId'] || 0;
        this.producerId = settings['layerId'] || 1;
        this.posX = settings['posX'] || 0;
        this.posY = settings['posY'] || 0;
        this.scaleX = settings['scaleX'] || 1;
        this.scaleY = settings['scaleY'] || 1;
        this.casparCommon = settings['casparCommon'] || null;
    }

    setInput(producerId){
        let req = `PLAY ${this.channelId}-${this.layerId} route://${this.getCasparCommon().getMvId()}-${producerId}`;
        this.producerId = producerId;
        return this.tcpPromise(req);
    }

    start(){
        let req = `PLAY ${this.channelId}-${this.layerId} route://${this.getCasparCommon().getMvId()}-${this.producerId}`;
        return this.tcpPromise(req);
    }

    stop(){
        let req = `STOP ${this.channelId}-${this.layerId}`;
        return this.tcpPromise(req);
    }

    mixerFill(){
        let req = `MIXER ${this.channelId}-${this.layerId} FILL ${this.posX} ${this.posY} ${this.scaleX} ${this.scaleY}`;
        this.tcpSend(req, function(){});
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            case 'layerId' : {
                this.setLayerId(value);
                response[setting] = this.getLayerId();
            }
            break;
            case 'producerId' : {
                this.setProducerId(value);
                response[setting] = this.getProducerId();
            }
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
                response['error'] = 'Setting not found : '+setting;
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
    setChannelId(channelid) { this.channelId = channelId; }

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

}


module.exports = CasparLayer;