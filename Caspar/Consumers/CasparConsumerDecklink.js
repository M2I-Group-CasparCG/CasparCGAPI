"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerDECKLINK extends CasparConsumer {

    constructor(settings){
        super(settings);
        this.decklinkID = settings['decklinkNb'] || 1;
        this.bufferDepth = settings['bufferDepth'] || 5;
        this.latency = settings['latency'] || 'default';
        
    }
}

module.exports = CasparConsumerDECKLINK;