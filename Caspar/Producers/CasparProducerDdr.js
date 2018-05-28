"use strict";
const CasparProducer = require('./CasparProducer.js');
const CasparPlaylist = require('./CasparPlaylist.js');
const CasparMedia = require('./CasparMedia.js');

class CasparProducerDDR extends CasparProducer{


    constructor(settings){
        CasparProducer.totalInstances = (CasparProducer.totalInstances || 0) + 1;
        super(settings);
        this.type = "DDR";
        this.id = CasparProducer.totalInstances;
        this.name = settings['name'] || 'DDR'+this.id;
        this.autoPlay = true;
        this.playMode = settings['playMode'] || '';
        this.playlist = settings['playlist'] || null;   
        this.currentIndex = 0;     
    }


    ini(){
        // checking that the playlist is alimented and that the index is existing
        if(this.playlist.length > 0){
            let req = `LOAD ${this.casparCommon.getMvId()}-${this.getId()} ${this.playlist[this.currentIndex]} ${this.getPlayMode()}`;
            return this.tcpPromise(req);
        }else{
            return false;
        }
    }

    run() {
        let req = `LOAD ${this.casparCommon.getMvId()}-${this.getId()} ${this.playlist[this.currentIndex]} ${this.getPlayMode()}`;
        this.tcpPromise(req)
            .then(
                function(resolve){
                    let req = `LOADBG ${this.casparCommon.getMvId()}-${this.getId()} ${this.getFileName()} ${this.getPlayMode()}`;
                    if (this.autoPlay){
                        req = `${req} AUTO`;
                    }
                    return this.tcpPromise(req);
                },
                function(reject){
                    return false;
                }
            )
    }

    pause() {
        let req = `PAUSE ${this.casparCommon.getMvId()}-${this.getId()}`;
        return this.tcpPromise(req);
    }


    stop() {
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        return this.tcpPromise(req);
    }

    next() {
        if (this.list.length < this.currentIndex){    
            this.currentIndex++;
            return this.run();
        }else{                  // end of playlist
            this.currentIndex = 0;
            return this.ini();
        }
    }

    previous() {
        if (this.currentIndex > 0){
            this.index--;
            return this.ini();
        }else{  //start of playlist
            return this.ini();
        }
    }


    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'playlist' : {
                this.setPlaylist(value);
                response[setting] = this.getPlaylist();
            }
            break;
            case 'playMode' : {
                this.setPlayMode(value);
                response[setting] = this.getPlayMode();
            }
            break;
            case 'autoPlay' : {
                this.setAutoPlay(value);
                response[setting] = this.getAutoPlay();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
        console.log(response);
        return response;
    }

    getPlaylist(){ return this.playlist;}
    setPlaylist(playlist){ this.playlist = playlist}

    getPlayMode(){ return this.playMode; }
    setPlayMode(playMode){ this.playMode = playMode; }

    getAutoPlay(){return this.autoPlay;}
    setAutoPlay(autoPlay){ this.autoPlay = autoPlay;}

    getCurrentIndex(){return this.currentIndex;}
    setCurrentIndex(index){this.currentIndex = index;}


}



module.exports = CasparProducerDDR;