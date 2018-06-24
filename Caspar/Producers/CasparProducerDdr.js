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
        this.paused = true;
        this.playlistLoop = settings['playlistLoop'] || false;
        this.mediaLoop = settings['mediaLoop'] || false;
        this.playlist = settings['playlist'] || new CasparPlaylist(new Array());   
        this.currentMedia = null;
        this.currentMediaIndex = 0;
       
        this.currentFileFrame = null;
        this.totalFileFrame = null;

        this.fileTime = null;
        this.formattedFileTime = null;

        this.remainingTime = null;
        this.formattedRemainingTime = null;

        this.nextIndex = 0;

        this.toBeIncremented = false;
        
    }


    async run() {
        console.log('ddr run');
        // if (this.currentMedia instanceof CasparMedia ){
        //     this.nextIndex = this.playlist.indexOf(this.currentMedia)+1;
        // }else{
        //     this.nextIndex = 0;
        // }
        this.nextIndex = 0;
        await this.tcpPromise(this.loadRequest(this.nextIndex));
        this.nextIndex++;
    }

    resume(){
        let req = `RESUME ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.play = true;
        return this.tcpPromise(req);
    }

    pause() {
        let req = `PAUSE ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.play = false;
        return this.tcpPromise(req);
    }

    stop() {
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.play = false;
        this.currentMediaIndex = 0;
        this.nextIndex=0;
        return this.tcpPromise(req);
    }

    async next() {
        this.currentMediaIndex = this.nextIndex;
        this.toBeIncremented = false;
        if (this.nextIndex == this.playlist.getList().length){
            if (this.playlistLoop){
                this.nextIndex = 0;
            }else{
                return;
            }
            
        }else{
            this.nextIndex++;
        }
        if (this.paused){
            return this.tcpPromise(this.loadRequest(this.currentMediaIndex));
        }else{
            return this.tcpPromise(this.playRequest(this.currentMediaIndex));
        }
    }

    async previous() {
        this.nextIndex -= 2;
        this.toBeIncremented = false;
        if (this.nextIndex < 0){
            this.nextIndex = this.playlist.getList().length -1;
        }
        this.currentMediaIndex = this.nextIndex;
        this.nextIndex++;
        if (this.paused){
            return this.tcpPromise(this.loadRequest(this.currentMediaIndex));
        }else{
            return this.tcpPromise(this.playRequest(this.currentMediaIndex));
        }
    }

    getCurrentMedia(){
        return this.currentMedia;
    }   

    playRequest(index){
        return  `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${this.playlist.getMedia(index).getFullPath()}`;
        if (this.mediaLoop){
            req = req+' LOOP';
        }
    }

    loadRequest(index){
        return  `LOAD ${this.casparCommon.getMvId()}-${this.getId()} ${this.playlist.getMedia(index).getFullPath()}`;
        if (this.mediaLoop){
            req = req+' LOOP';
        }
    }

    loadBgRequest (index){
        let req = `LOADBG ${this.casparCommon.getMvId()}-${this.getId()} ${this.playlist.getMedia(index).getFullPath()}`;
        if (this.mediaLoop){
            req = req+' LOOP';
        }
        if (this.autoPlay){
            req = req+' AUTO';
        }
        return req;
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
            case 'playlistLoop' : {
                this.setPlaylistLoop(value);
                response[setting] = this.getPlaylistLoop();
            }
            break;
            case 'mediaLoop' : {
                this.setMediaLoop(value);
                response[setting] = this.mediaLoop();
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

    timeFormat(duration){
        let seconds = (duration-duration % 1) % 60 ;
        let minutes = (duration - duration % 60) / 60;
        let hours = (duration - duration % 3600) / 3600;


        
        return `${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}:${('0'+seconds).slice(-2)}`;
    }


    getPlaylist(){ return this.playlist;}
    setPlaylist(playlist){ this.playlist = playlist; this.currentMedia = null;}

    getPlaylistLoop() { return this.playlistLoop;}
    setPlaylistLoop(bool) { this.playlistLoop = bool;}

    getMediaLoop() { return this.mediaLoop;}
    setMediaLoop(bool) { this.mediaLoop = bool;}

    getAutoPlay(){return this.autoPlay;}
    setAutoPlay(autoPlay){ this.autoPlay = autoPlay;}

    getNextIndex(){return this.nextIndex;}
    setNextIndex(index){this.nextIndex = index;}

    getCurrentMedia() { return this.currentMedia;}
    setCurrentMedia(media) { 
        this.currentMedia = media;

        if (this.toBeIncremented){
            this.currentMediaIndex = this.nextIndex;
            this.nextIndex++;
        }else{
            this.toBeIncremented = true;
        }

        if (this.nextIndex < this.playlist.getList().length){
                this.tcpPromise(this.loadBgRequest(this.nextIndex));           
        }else if (this.nextIndex >= this.playlist.getList().length && this.playlistLoop){
            this.nextIndex = 0;
            this.tcpPromise(this.loadBgRequest(this.nextIndex));
        }else if (this.nextIndex < 0 && this.playlistLoop){
            this.nextIndex = this.playlist.getList().length-1;
            this.tcpPromise(this.loadBgRequest(this.nextIndex));
        }

     
            
        
        // this.currentIndex = this.playlist.getList().indexOf(this.currentMedia);
        // this.nextIndex = this.currentIndex+1;
        // if (this.nextIndex < this.playlist.getList().length){
        //     this.tcpPromise(this.loadBgRequest(this.nextIndex));           
        // }else if (this.playlistLoop){
        //     this.nextIndex = 0;
        //     this.tcpPromise(this.loadBgRequest(this.nextIndex));
        // }
        
    }

    getPaused () { return this.paused; }
    setPaused (bool){ this.paused = bool;}

    getFileTime () { return this.fileTime;}
    setFileTime(time) {
        this.fileTime = time;
        this.formattedFileTime = this.timeFormat(time);
        console.log(this.currentMedia);
        if (this.currentMedia != null){
            this.remainingTime = this.currentMedia.getFrameNumber()*this.currentMedia.getFrameRate()-time;
            this.formattedRemainingTime = this.timeFormat(this.remainingTime);
        }
       
    }

    getFormattedRemainingTime() { return this.formattedRemainingTime; }

    getRemainingTime() { return this.remainingTime; }


    getFormattedFileTime () { return this.formattedFileTime; }
    setFormattedFileTime (time) { this.formattedFileTime = time;}

    getCurrentFileFrame () { return this.currentFileFrame;}
    setCurrentFileFrame (frame) { this.currentFileFrame = frame;}
    
    getTotalFileFrame () { return this.totalFileFrame;}
    setTotalFileFrame (frame) { this.totalFileFrame = frame;}

    getCurrentMediaIndex() { return this.currentMediaIndex;}

    // getNextMediaIndex(){ return this.getNextMediaIndex;}
}



module.exports = CasparProducerDDR;