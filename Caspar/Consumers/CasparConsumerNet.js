"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerNet extends CasparConsumer {

    // ADD 1 STREAM udp://192.168.1.181:5004 -vcodec libx264 -tune zerolatency -preset ultrafast -crf 25 -format mpegts -vf scale=720:576

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        super(settings);
        this.id = CasparConsumer.totalInstances;
        this.type = 'STREAM';
        this.protocol = settings['protocol'] || 'udp'
        this.host = settings['host'] || '127.0.0.1';
        this.port = settings['port'] || 5004;
        this.vcodec = settings['vcodec'] || 'libx264';
        this.tune = settings['tune'] || 'zerolatency';
        this.preset = settings['preset'] || 'ultrafast';
        this.format = settings['format'] || 'mpegts'
        this.pictureWidth = settings['pictureWidth'] || '1920';
        this.pictureHeight = settings['pictureHeight'] || '1080';
        this.crf = settings['crf'] || 25        // constant frame factor - compression factor from 0 (high quality) to 51 (low quality)80
    }   

    async run(){
        var req = `ADD ${this.channelId} ${this.type} ${this.protocol}://${this.host}:${this.port} -vcodec ${this.vcodec} -tune ${this.tune} -preset ${this.preset} -crf ${this.crf} -format ${this.format} -vf scale=${this.pictureWidth}:${this.pictureHeight}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(true);
                    consumer.getCasparCommon().sendSocketIo('consumerAdd', consumer);
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    async stop(sendSocketIo = true){
        var req = `REMOVE ${this.channelId} ${this.type} ${this.protocol}://${this.host}:${this.port}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(false);
                    if(sendSocketIo){
                        consumer.getCasparCommon().sendSocketIo('consumerEdit', consumer);
                    }
                    result.push(resolve);
                },function(reject){
                   result.push(reject);
                }
            )
        return result;
    }

    // edit(setting, value){
    //     let response = new Object();
    //     switch (setting){
    //         case 'name' : {
    //             this.setName(value);
    //             response[setting] = this.getName();
    //         }
    //         break;
    //         case 'channelId' : {
    //             this.setChannelId(value);
    //             response[setting] = this.getChannelId();
    //         }
    //         break;
    //         case 'protocol' : {
    //             this.setProtocol(value);
    //             response[setting] = this.getProtocol();
    //         }
    //         break;
    //         case 'host' : {
    //             this.setHost(value);
    //             response[setting] = this.getHost();
    //         }
    //         break;
    //         case 'port' : {
    //             this.setPort(value);
    //             response[setting] = this.getPort();
    //         }
    //         break;
    //         case 'vcodec' : {
    //             this.setVcodec(value);
    //             response[setting] = this.getVcodec();
    //         }
    //         break;
    //         case 'tune' : {
    //             this.setTune(value);
    //             response[setting] = this.getTune();
    //         }
    //         break;
    //         case 'preset' : {
    //             this.setPreset(value);
    //             response[setting] = this.getPreset();
    //         }
    //         break;
    //         case 'format' : {
    //             this.setFormat(value);
    //             response[setting] = this.getFormat();
    //         }
    //         break;
    //         case 'pictureWidth' : {
    //             this.setPictureWidth(value);
    //             response[setting] = this.getPictureWidth();
    //         }
    //         break;
    //         case 'pictureHeight' : {
    //             this.setPictureHeight(value);
    //             response[setting] = this.getPictureHeight();
    //         }
    //         break;
    //         case 'crf' : {
    //             this.setCrf(value);
    //             response[setting] = this.getCrf();
    //         }
    //         break;
    //         default : {
    //             response[setting] = "not found";
    //         }
    //     }
    //     return response;
    // }

    edit(settings){

        let result = new Object();
            result['consumerId'] = this.getId();
            
        for (let [setting, value] of Object.entries(settings)) {
            switch (setting){
                case 'name' : {
                    this.setName(value);
                    result[setting] = this.getName();
                }
                break;
                case 'channelId' : {
                    this.setChannelId(value);
                    result[setting] = this.getChannelId();
                }
                break;
                case 'protocol' : {
                    this.setProtocol(value);
                    result[setting] = this.getProtocol();
                }
                break;
                case 'host' : {
                    this.setHost(value);
                    result[setting] = this.getHost();
                }
                break;
                case 'port' : {
                    this.setPort(value);
                    result[setting] = this.getPort();
                }
                break;
                case 'vcodec' : {
                    this.setVcodec(value);
                    result[setting] = this.getVcodec();
                }
                break;
                case 'tune' : {
                    this.setTune(value);
                    result[setting] = this.getTune();
                }
                break;
                case 'preset' : {
                    this.setPreset(value);
                    result[setting] = this.getPreset();
                }
                break;
                case 'format' : {
                    this.setFormat(value);
                    response[setting] = this.getFormat();
                }
                break;
                case 'pictureWidth' : {
                    this.setPictureWidth(value);
                    response[setting] = this.getPictureWidth();
                }
                break;
                case 'pictureHeight' : {
                    this.setPictureHeight(value);
                    response[setting] = this.getPictureHeight();
                }
                break;
                case 'crf' : {
                    this.setCrf(value);
                    response[setting] = this.getCrf();
                }
                break;
                default : {
                    response[setting] = "not found";
                }       
            }
        }
        return result;
    }

    getUrl(){return this.getUrl};
    setUrl(url){this.url = url}

    getProtocol(){return this.protocol; }
    setProtocol(protocol){this.protocol=protocol;}

    getHost(){return this.host;}
    setHost(host){this.host = host;}

    getPort(){return this.port;}
    setPort(port){this.port = port;}

    getVcodec(){return this.vcodec;}
    setVcodec(vcodec){this.vcodec = vcodec;}

    getTune(){return this.tune;}
    setTune(tune){this.tune = tune;}

    getPreset(){return this.preset;}
    setPreset(preset){this.preset = preset;}

    getFormat(){return this.format;}
    setFormat(format){this.format = format;}

    getPictureWidth(){return this.pictureWidth;}
    setPictureWidth(pictureWidth){this.pictureWidth = pictureWidth;}

    getPictureHeight(){return this.pictureHeight;}
    setPictureHeight(pictureHeight){this.pictureHeight = pictureHeight;}

    getCrf(){return this.crf;}
    setCrf(crf){this.crf = crf;}

}

module.exports = CasparConsumerNet;