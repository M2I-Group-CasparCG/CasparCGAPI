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
        this.pausedTimeout = false;
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
        this.currentIndex = -1;
        this.nextIndex = null;
        this.currentMedia = null;
        this.nextMedia = null;

        this.lock = false;

        this.playlist.setCasparCommon(this.getCasparCommon());

        this.unpauseCount = 0;

    }

    /**
     * If set, load the first media of the playlist. 
     */
    async run() {
        if (this.playlist.getList().length > 0){
            this.currentIndex = 0;
            let req  = this.loadRequest(0);

            let producer = this;
            this.tcpPromise(req)
                .then(
                    function(resolve){
                        producer.setStarted(true);
                        producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                        console.log(resolve);
                        return true;
                    }, function(reject){
                        console.log(reject);
                        return false;
                    }
                )
        }
    }

    stop() {
        let req = `STOP ${this.casparCommon.getMvId()}-${this.getId()}`;
        let producer = this;
        this.tcpPromise(req)
            .then(
                function(resolve){
                    producer.setCurrentIndex(-1);
                    producer.setStarted(false);
                    producer.getCasparCommon().sendSocketIo('producerEdit', producer);
                    return true;
                },function(reject){
                    return false;
                }
            )
   }

    /**
     * Continue the playing after a pause
     */
    async resume(){
        let req = '';
        if (this.currentIndex > -1){
            req = `RESUME ${this.casparCommon.getMvId()}-${this.getId()}`;
        }else{
            this.currentIndex = 0;
            req = this.playRequest(this.currentIndex);
        } 
        let producer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){
                    producer.setPaused(false);
                    producer.getCasparCommon().sendSocketIo('ddrEdit', producer);
                    console.log(resolve);
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
        if (this.autoPlay){
            let nextIndex = this.indexVerify(this.currentIndex+1);
            await this.tcpPromise(this.loadBgRequest(nextIndex))
                .then(
                    function(resolve){
                        producer.setNextIndex(nextIndex);
                        result.push(resolve);
                    },function(reject){
                        result.push(reject);
                    }
                );
        }
        return result;
    }

    /**
     * Pause the 
     */
    pause() {
        let req = `PAUSE ${this.casparCommon.getMvId()}-${this.getId()}`;
        let producer = this;
        this.tcpPromise(req)
            .then(
                function(resolve){
                    producer.setPaused(true);
                    producer.getCasparCommon().sendSocketIo('ddrEdit', producer);
                    console.log(resolve);
                    return true;
                },function(reject){
                    console.log(reject);
                    return false;
                }
            )
    }



    async playId(index){
        if (this.playlist.list[index] instanceof CasparMedia){
            let req = this.loadRequest(index);
            let producer = this;
            let result = [];
            await this.tcpPromise(req)
                .then(
                    function(resolve){
                        producer.setCurrentIndex(index);
                        producer.getCasparCommon().sendSocketIo('ddrEdit', producer);
                        producer.setLock(true);
                        producer.unpauseCount = 3;
                        result.push(resolve);
                    },function(reject){
                        result.push(reject);
                    }
                )
            if (this.autoPlay){
                let nextIndex = this.indexVerify(this.currentIndex+1);
                await this.tcpPromise(this.loadBgRequest(nextIndex))
                    .then(
                        function(resolve){
                            result.push(resolve);
                            producer.getCasparCommon().sendSocketIo('ddrEdit', producer);
                            producer.setNextIndex(nextIndex);
                        },function(reject){
                            result.push(reject);
                        }
                    );
            }
            return result;
            
        }else{
            return false;
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
        let promise = this.tcpPromise(req)
        let producer = this;
        if (this.autoPlay){
            let nextIndex = this.indexVerify(this.currentIndex+1);
            this.tcpPromise(this.loadBgRequest(nextIndex))
                .then(
                    function(resolve){
                        producer.setLock(true);
                        console.log(resolve);
                    },function(reject){
                        console.log(reject);
                    }
                )
        }  
        return promise;
    }

    async next() {
        let nextIndex = this.indexVerify(this.currentIndex+1);
        if (this.currentIndex !== nextIndex){
            // this.currentIndex = nextIndex;
            let producer = this;
            let result = [];
            let req = '';
            if (this.getPaused()){
                req = this.loadRequest(nextIndex);
            }else{
                req = this.playRequest(nextIndex);
            }
            // if ( this.autoPlay){
            //     req = req+' AUTO';
            // }
            await this.tcpPromise(req)
                .then(
                    function(resolve){
                        producer.setCurrentIndex(nextIndex);
                        producer.setLock(true);
                        result.push(resolve);
                    },function(reject){
                        result.push(reject);
                    }
                )
            if (this.autoPlay){
                let nextIndex = this.indexVerify(this.currentIndex+1);
                await this.tcpPromise(this.loadBgRequest(nextIndex))
                    .then(
                        function(resolve){
                            producer.setNextIndex(nextIndex);
                            result.push(resolve);
                        },function(reject){
                            result.push(reject);
                        }
                    );
            }
            
        }
    }

    async previous() {
        let nextIndex = this.indexVerify(this.currentIndex-1);
        if (this.currentIndex !== nextIndex){
            // this.currentIndex = nextIndex;
            let producer = this;
            let result = [];
            let req = '';
            if (this.getPaused()){
                req = this.loadRequest(nextIndex);
            }else{
                req = this.playRequest(nextIndex);
            }
            // if ( this.autoPlay){
            //     req = req+' AUTO';
            // }
            await this.tcpPromise(req)
                .then(
                    function(resolve){
                        producer.setCurrentIndex(nextIndex);
                        producer.setLock(true);
                        result.push(resolve);
                    },function(reject){
                        result.push(reject);
                    }
                )
            if (this.autoPlay){
                let nextIndex = this.indexVerify(this.currentIndex+1);
                await this.tcpPromise(this.loadBgRequest(nextIndex))
                    .then(
                        function(resolve){
                            producer.setNextIndex(nextIndex);
                            result.push(resolve);
                        },function(reject){
                            result.push(reject);
                        }
                    );
            }
            
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
            if ( this.autoPlay){
                req = req+' AUTO';
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

    /**
     * Edit a setting of the playlist 
     * Used for the API
     * @param {*} setting the attribute name to be edited
     * @param {*} value the new value to set
     * @return an object with the attribute edited as key and the new value or "not found" (if the attribute doesn't exists or is not editable) as value
     */
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
        this.tcpPromise(this.loadBgRequest(nextIndex))
            .then(
                function(resolve){
                    console.log(resolve);
                },function(reject){
                    console.log(reject);
                }
            )
        this.getCasparCommon().sendSocketIo('ddrEdit', this);
    }

    getMediaLoop() { return this.mediaLoop;}
    setMediaLoop(bool) { this.mediaLoop = bool;}

    getAutoPlay(){return this.autoPlay;}
    setAutoPlay(autoPlay){ 
        this.autoPlay = autoPlay;
        let nextIndex = this.indexVerify(this.currentIndex+1);
        this.tcpPromise(this.loadBgRequest(nextIndex))
            .then(
                function(resolve){
                    console.log(resolve);
                },function(reject){
                    console.log(reject);
                }
            )
        this.getCasparCommon().sendSocketIo('ddrEdit', this);
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

        // if (this.fileTime > time){ // media gone backward or new media detected
        //     this.fileTime = time;
        //     if (! this.lock){
        //         this.fileTime = time;
        //         console.log('NEW FILE ***************************************************');
        //         this.currentIndex = this.nextIndex;
        //         this.setCurrentMedia(this.nextMedia);
        //         let nextIndex = this.indexVerify(this.currentIndex +1);
        //         if (nextIndex != this.currentIndex){
        //             await this.tcpPromise(this.loadBgRequest(nextIndex));
        //         }
        //     }       
        // }
        // this.fileTime = time;
        // this.formattedFileTime = this.timeFormat(time);
        // if (this.currentMedia != null){
        //     this.remainingTime = this.currentMedia.getFrameNumber()*this.currentMedia.getFrameRate()-time;
        //     this.formattedRemainingTime = this.timeFormat(this.remainingTime);
        // }
        // this.lock = false;
        // console.log(time);
        if (this.fileTime > time){ // media gone backward or new media detected
            console.log('nextIndex to be loaded');
            this.fileTime = time;

            if (!this.lock){
                this.currentIndex = this.nextIndex;
                let nextIndex = this.indexVerify(this.currentIndex +1);
                // 
                let producer = this;
                if (nextIndex != this.currentIndex){
                    await this.tcpPromise(this.loadBgRequest(nextIndex))
                        .then(
                            function(resolve){
                                // console.log('next index loaded !');
                                producer.setNextIndex(nextIndex);
                                console.log(resolve);
                            }, function(reject){
                                console.log(reject);
                            }
                        )
                }else{
                    // console.log('loading canceled, next and current index are the same');
                }
            }else{
                // console.log('loading canceled, lock is set');
                this.setLock(false);
            }

        }else if(this.fileTime == time){
                this.setPaused(true);
        }else{
            this.fileTime = time;
            if (this.unpauseCount == 0){
                this.setPaused(false);
            }else{
                this.unpauseCount -=1;
            }
        }
        
        this.formattedFileTime = this.timeFormat(time);
        if (this.currentMedia != null){
            this.remainingTime = this.currentMedia.getFrameNumber()*this.currentMedia.getFrameRate()-time;
            this.formattedRemainingTime = this.timeFormat(this.remainingTime);
        }
        
        this.getCasparCommon().sendSocketIo('ddrEdit', this);   
    }

    getFormattedRemainingTime() { return this.formattedRemainingTime; }

    getRemainingTime() { return this.remainingTime; }

    getFormattedFileTime () { return this.formattedFileTime; }
    setFormattedFileTime (time) { this.formattedFileTime = time;}

    getCurrentFileFrame () { return this.currentFileFrame;}
    setCurrentFileFrame (frame) { this.currentFileFrame = frame;}
    
    getTotalFileFrame () { return this.totalFileFrame;}
    setTotalFileFrame (frame) { this.totalFileFrame = frame;}

    setCurrentIndex(index){this.currentIndex = index;}
    getCurrentIndex() { return this.currentIndex;}

    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }

    setLock(boolean){this.lock = boolean;}
    getLock(){return this.lock;}

}



module.exports = CasparProducerDDR;