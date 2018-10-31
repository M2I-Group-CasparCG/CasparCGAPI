"use strict";

const utils     = require('../../utils.js');

class CasparProducer {

    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        this.id = CasparProducer.totalInstances;
        this.object='Producer';
        this.type = null;
        this.casparCommon = null;
        this.name = settings['name'] || `producer-${this.id}`;
        this.started = false;
    }

    run(){
        utils.debug('yellow',`Running ${this.object} - "${this.name}" - id : ${this.id}`)
    }

    stop(){
        utils.debug('yellow',`Stopping ${this.object} - "${this.name}" - id : ${this.id}`)
    }

    /**
     * @return the current object cleaned from circular reference 
     */
    clean(){
        const copy = Object.assign({}, this);
        copy.casparCommon = copy.casparCommon.clean();
        return copy;
    }

    /**
     * Getters/Setters
     */

    getId(){ return this.id; }
    getType(){ return this.type; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }
    getCasparCommon(){
        return this.casparCommon;
    }

    getStarted(){return this.started;}
    setStarted(boolean){this.started = boolean;}

    tcpPromise(msg){ return this.casparCommon.tcpPromise(msg); }
}

module.exports = CasparProducer;