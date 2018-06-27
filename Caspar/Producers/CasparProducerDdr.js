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

        // file times
        this.currentFileFrame = null;
        this.totalFileFrame = null;
        this.fileTime = -1;
        this.formattedFileTime = null;
        this.remainingTime = null;
        this.formattedRemainingTime = null;

        //playlist index
        
        this.currentIndex = 0;
        this.nextIndex = null;
        this.currentMedia = null;
        this.nextMedia = null;

        this.lock = false;
        this.initialized = false;

        this.playlist.setCasparCommon(this.getCasparCommon());
    }

    /**
     * Init the DDR by loading the first file of the playlist
     */
    async run() {
        
       
        // init the plyalist
        this.currentIndex = this.indexVerify(this.currentIndex);
        // loading the first media of the playlist

        if (this.currentIndex >= 0){
            if (this.paused){
                await this.tcpPromise(this.loadRequest(this.currentIndex));
            }else{
                await this.tcpPromise(this.playRequest(this.currentIndex));
            }
           
            if (this.autoPlay){
                let nextIndex = this.indexVerify(this.currentIndex+1);
                await this.tcpPromise(this.loadBgRequest(nextIndex));
            }
            this.initialized = true;
            this.lock = true;
        }
    }

    /**
     * Continue the playing after a pause
     */
    resume(){
        let req = `RESUME ${this.casparCommon.getMvId()}-${this.getId()}`;
        let promise = this.tcpPromise(req);
        if (this.autoPlay){
            console.log('AUTOPLAY');
            let nextIndex = this.indexVerify(this.currentIndex+1);
            this.tcpPromise(this.loadBgRequest(nextIndex));
        }
        this.lock = true;
        this.play = true;
        return promise;
    }

    /**
     * Pause the 
     */
    pause() {
        let req = `PAUSE ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.play = false;
        return this.tcpPromise(req);
    }

    stop() {
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        this.play = false;
        this.nextIndex=0;
        this.currentIndex=0;
        this.currentMedia = null;
        this.nextMedia = null;
        return this.tcpPromise(req);
    }

    playId(index){
        if (this.playlist.list[index] instanceof CasparMedia){
            this.currentIndex = index;
            return this.run();
        }else{
            return Promise.resolve('');
        }

    }

    seek(frame){
        this.lock = true;
        let req = '';      
        if (this.paused){
            req = this.loadRequest(this.currentIndex)
        }else{
            req = this.playRequest(this.currentIndex)
        }  
        req+= ' SEEK '+frame; 
        let promise = this.tcpPromise(req);
        if (this.autoPlay){
            let nextIndex = this.indexVerify(this.currentIndex+1);
            this.tcpPromise(this.loadBgRequest(nextIndex));
        }  
        return promise;
    }

    async next() {
        let nextIndex = this.indexVerify(this.currentIndex+1);
        console.log('index : ' + nextIndex);
        let req = '';
        this.lock = true;
        if (this.currentIndex !== nextIndex){
            this.currentIndex = nextIndex;
            if (this.paused){
                req = this.loadRequest(this.currentIndex)
            }else{
                req = this.playRequest(this.currentIndex)
            }
            let promise = this.tcpPromise(req);
            if (this.autoPlay){
                console.log('AUTOPLAY');
                let nextIndex = this.indexVerify(this.currentIndex+1);
                this.tcpPromise(this.loadBgRequest(nextIndex));
            }
            this.lock = true;
            return promise;
        }else{
            return Promise.resolve('');
        }
    }

    async previous() {
        let nextIndex= this.indexVerify(this.currentIndex-1);
        console.log('index : ' + this.currentIndex);
        this.lock = true;
        let req = '';
        if (this.currentIndex !== nextIndex){
            this.currentIndex = nextIndex;
            if (this.paused){
                req = this.loadRequest(this.currentIndex)
            }else{
                req = this.playRequest(this.currentIndex)
            }
            let promise = this.tcpPromise(req);
            if (this.autoPlay){
                console.log('AUTOPLAY');
                let nextIndex = this.indexVerify(this.currentIndex+1);
                this.tcpPromise(this.loadBgRequest(nextIndex));
            }
            this.lock = true;
            return promise;
        }else{
            return Promise.resolve('');
        }
    }

    getCurrentMedia(){
        return this.currentMedia;
    }   

    playRequest(index){
        let media = this.playlist.getMedia(index);
        let req =  `PLAY ${this.casparCommon.getMvId()}-${this.getId()} ${media.getFullPath()}`;
        if (this.mediaLoop){
            req = req+' LOOP';
        }
        this.setCurrentMedia(media);
        return req;
    }

    /**
     * Build the AMCP request and edit the currentMedia property
     * @param {*} index 
     */
    loadRequest(index){
        let media = this.playlist.getMedia(index);
        let req = '';
        if (media != undefined){
            req =   `LOAD ${this.casparCommon.getMvId()}-${this.getId()} ${media.getFullPath()}`;
            if (this.mediaLoop){
                req = req+' LOOP';
            }
            this.setCurrentMedia(media);
        }
        
        return req;
    }
    /**
     * Build the AMCP request and edit the nextMedia property
     * @param {*} index 
     */
    loadBgRequest (index){
        let media = this.playlist.getMedia(index);
        let req = `LOADBG ${this.casparCommon.getMvId()}-${this.getId()} ${media.getFullPath()}`;
        if (this.mediaLoop){
            req = req+' LOOP';
        }
        if (this.autoPlay){
            req = req+' AUTO';
        }
        this.nextMedia = media;
        this.nextIndex = index;
        return req;
    }

    /**
     * Check if an index is valid and return a valid index if possible, or false. 
     * @param {*} index 
     */
    indexVerify(index){
        // if we are at the end of the playlist.
        if (index >= this.playlist.getList().length){
            if (this.playlistLoop){
                index = 0;
            }else{
                index = index-1;
            }
        // if we are at the start of the playlist while getting backward
        }else if (index < 0){
            if (this.playlistLoop){
                index = this.playlist.getList().length -1;
            }else{
                index = index+1;
            }
        }
        return index;
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
        return response;
    }

    timeFormat(duration){
        let seconds = (duration-duration % 1) % 60 ;
        let minutes = (duration - duration % 60) / 60;
        let hours = (duration - duration % 3600) / 3600;

        return `${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}:${('0'+seconds).slice(-2)}`;
    }


    getPlaylist(){ return this.playlist;}
    setPlaylist(playlist){ 
        this.playlist = playlist; 
        this.currentMedia = null;
        this.playlist.setCasparCommon(this.getCasparCommon());}

    getPlaylistLoop() { return this.playlistLoop;}
    setPlaylistLoop(bool) { 
        this.playlistLoop = bool;
        let nextIndex = this.indexVerify(this.currentIndex+1);
        this.tcpPromise(this.loadBgRequest(nextIndex));
    }

    getMediaLoop() { return this.mediaLoop;}
    setMediaLoop(bool) { this.mediaLoop = bool;}

    getAutoPlay(){return this.autoPlay;}
    setAutoPlay(autoPlay){ 
        this.autoPlay = autoPlay;
        let nextIndex = this.indexVerify(this.currentIndex+1);
        this.tcpPromise(this.loadBgRequest(nextIndex));
    }

    getNextIndex(){return this.nextIndex;}
    setNextIndex(index){this.nextIndex = index;}

    getCurrentMedia() { return this.currentMedia;}
    setCurrentMedia(media) { 
        this.currentMedia = media;
        this.totalFileFrame = media.getFrameNumber();
    }

    getPaused () { return this.paused; }
    setPaused (bool){ this.paused = bool;}

    getFileTime () { return this.fileTime;}
    async setFileTime(time) {
        // console.log(time +'|'+ this.fileTime)
        if (this.fileTime > time){ // media gone backward or new media detected
            this.fileTime = time;
            if (! this.lock){
                this.fileTime = time;
                console.log('NEW FILE ***************************************************');
                
                let nextIndex = this.indexVerify(this.currentIndex +1);
                 console.log( this.playlist.list.length);
                 console.log(nextIndex);
                 console.log(this.currentIndex);
                if (nextIndex != this.currentIndex || this.playlist.list.length == 1){
                    console.log('load next');
                    this.currentIndex = this.nextIndex;
                    this.setCurrentMedia(this.nextMedia);
                    await this.tcpPromise(this.loadBgRequest(nextIndex));
                }
            }       
        }
        this.fileTime = time;
        this.formattedFileTime = this.timeFormat(time);
        if (this.currentMedia != null){
            this.remainingTime = this.currentMedia.getFrameNumber()*this.currentMedia.getFrameRate()-time;
            this.formattedRemainingTime = this.timeFormat(this.remainingTime);
        }
        this.lock = false;
       
    }

    getFormattedRemainingTime() { return this.formattedRemainingTime; }

    getRemainingTime() { return this.remainingTime; }


    getFormattedFileTime () { return this.formattedFileTime; }
    setFormattedFileTime (time) { this.formattedFileTime = time;}

    getCurrentFileFrame () { return this.currentFileFrame;}
    setCurrentFileFrame (frame) { this.currentFileFrame = frame;}
    
    getTotalFileFrame () { return this.totalFileFrame;}
    setTotalFileFrame (frame) { this.totalFileFrame = frame;}

    getCurrentIndex() { return this.currentIndex;}

    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }

    // getNextMediaIndex(){ return this.getNextMediaIndex;}
}



module.exports = CasparProducerDDR;