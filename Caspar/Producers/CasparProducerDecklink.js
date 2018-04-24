"use strict";
var CasparProducer = require('./CasparProducer.js');

class CasparProducerDECKLINK extends CasparProducer{

    constructor(settings, casparCommon){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings, casparCommon);
        this.type = 'DECKLINK';
        this.decklinkId = settings['decklinkId'] || 0;
        this.casparCommon = casparCommon;
        this.id = CasparProducer.totalInstances;
        this.embeddedAudio = null;
        this.channelLayout = null;
        this.latency = null;
        this.bufferDepth = null;

        // <decklink>
        //         <device>[1..]</device>
        //         <key-device>device + 1 [1..]</key-device>
        //         <embedded-audio>false [true|false]</embedded-audio>
        //         <channel-layout>stereo [mono|stereo|dts|dolbye|dolbydigital|smpte|passthru]</channel-layout>
        //         <latency>normal [normal|low|default]</latency>
        //         <keyer>external [external|external_separate_device|internal|default]</keyer>
        //         <key-only>false [true|false]</key-only>
        //         <buffer-depth>3 [1..]</buffer-depth>
        //         <custom-allocator>true [true|false]</custom-allocator>
        //     </decklink>

    }

    run(){
        let req = `PLAY ${this.casparCommon.getMvId()}-${this.getId()} DECKLINK ${this.decklinkId}`;
        console.log(req);
        return this.tcpPromise(req, function(){});
    }

    stop(){
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()} DECKLINK ${this.decklinkId}`;
        return this.tcpPromise(req, function(){});
    }

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'decklinkId' : {
                this.setDecklinkId(value);
                response[setting] = this.getDecklinkId();
            }
            break;
            case 'embeddedAudio' : {
                this.setEmbeddedAudio(value);
                response[setting] = this.getEmbeddedAudio();
            }
            break;
            case 'channelLayout' : {
                this.setChannelLayout(value);
                response[setting] = this.getChannelLayout();
            }
            break;
            case 'latency' : {
                this.setLatency(value);
                response[setting] = this.getLatency();
            }
            break;
            case 'bufferDepth' : {
                this.setBufferDepth(value);
                response[setting] = this.getBufferDepth();
            }
            break;
            default : {
                response['error'] = 'Setting not found : '+setting;
            }
        }
        console.log(response);
        return response;
    }

    getDecklinkId () { return this.decklinkId; }
    setDecklinkId (id) { this.decklinkId = this.decklinkId}

    getEmbeddedAudio () { return this.embeddedAudio;}
    setEmbeddedAudio( embeddedAudio ) { this.embeddedAudio = embeddedAudio; }

    getChannelLayout () { return this.channelLayout; }
    setChannelLayout (channelLayout) { this.channelLayout = channelLayout; }

    getLatency () { return this.latency; }
    setLatency (latency) { this.latency = latency; }

    getBufferDepth () { return this.bufferDepth; }
    setBufferDepth () { this.bufferDepth = this.bufferDepth; }





}



module.exports = CasparProducerDECKLINK;