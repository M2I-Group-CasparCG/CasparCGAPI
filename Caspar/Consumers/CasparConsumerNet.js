"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerNet extends CasparConsumer {

    constructor(settings){
        super(settings);
        this.url = settings['url'] || 'udp://127.0.0.1:5004';
        this.codec = settings['codec'] || 'libx264';
        this.pictureWidth = settings['pictureWidth'] || '1920';
        this.pictureHeight = settings['pictureHeight'] || '1080';

         // -vcodec libx264 -tune zerolatency -preset ultrafast -crf 25 -format mpegts -vf scale=240:180
    }

}

module.exports = CasparConsumerNet;