"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerFILE extends CasparConsumer {

    constructor(settings){
        super(settings);
        this.fileName = settings['fileName'] || 'defaultVideoFile.mp4';
        this.videoCodec = settings['codec'] || 'libx264';
    }

}

module.exports = CasparConsumerFILE;