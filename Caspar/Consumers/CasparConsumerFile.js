"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerFILE extends CasparConsumer {

    constructor(settings){
        super(settings);
        this.type = 'FILE'
        this.fileName = settings['fileName'] || 'defaultVideoFile.mov';
        this.filePath = settings['filePath'] || '';
        this.frames = 0;
        this.fullSizePath = this.generateTotaleFilePath();
        this.currentRecordName = null;
        this.formattedDuration = null;
        this.frameRate = null;
        this.started = false;
        this.lastUpdate = 0;

        const consumer = this;
        setInterval(
            function () {
                const date = new Date();
                if(date - consumer.lastUpdate > 500){
                    consumer.setStarted(false);
                    consumer.getCasparCommon().getSocketIo().emit('consumerEdit',JSON.stringify(consumer.clean()));
                }
            },500);
       
        /**
         * -f // container format
            -vcodec // vicdeo codec
            -pix_fmt // pixel_format
            -r // video framerate
            -s // size
            -b // video bitrate
            -acodec // audio codec
            -ar // audio samplerate
            -ab // audio bitrate
            -ac // audio channels

            ADD 1 FILE myfile.mov -vcodec dnxhd
            ADD 1 FILE myfile.mov -vcodec prores
            ADD 1 FILE myfile.mov -vcodec dvvideo
            ADD 1 FILE myfile.mov -vcodec libx264

            Same settings as ConsumerStream

         */
    }

    generateTotaleFilePath (){
        let totalPath;
        if (this.filePath.slice(-1) == "/" || this.filePath.slice(-1) == "\\"){
            this.filePath = this.filePath.slice(0, -1);
        }
        if (this.filePath != '') {
            return `${this.filePath}/${this.fileName}`;
        }else{
            return `${this.fileName}`;
        }
        
    }

    /**
     * Calcul the file time and return a formatted string 'HH:MM:SS:FF' format
     * @param {*} frameNb number of frames of the media
     * @param {*} frameRate frame rate of the media
     * @return {String} The formatted duration
     */
    timeFormat(frameNb, frameRate){

        let duration = frameNb*frameRate;                   // duration en seconds
        let brutHours = duration / 3600;
        let hours = Math.floor(brutHours);
        let brutMinutes = (brutHours - hours) * 60;
        let minutes = Math.floor(brutMinutes);
        let brutSeconds = (brutMinutes - minutes) *60;
        let seconds = Math.floor(brutSeconds);
        let frames = Math.round((brutSeconds - seconds) / frameRate);
        // this.started = false;
        // let frames = frameNb - (seconds + 60*minutes + 3600*hours)/frameRate;

        return `${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}:${('0'+seconds).slice(-2)}:${('0'+frames).slice(-2)}`;
    }


    async run() {
        super.run();
        this.setCurrentRecordName();
        var req = `ADD ${this.channelId} ${this.type} ${this.getCurrentRecordName()}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    result.push(resolve);
                    consumer.setStarted(true);
                    consumer.getCasparCommon().sendSocketIo('consumerEdit', consumer);
                },function(reject){
                    result.push(reject);
                }
            )
        return result;
    }

    async stop(sendSocketIo = true) {
        super.stop();
        var req = `REMOVE ${this.channelId} ${this.type}  ${this.filePath}${this.fileName}`;
        let consumer = this;
        let result = [];
        await this.tcpPromise(req)
            .then(
                function(resolve){  
                    consumer.setStarted(false);
                    if (sendSocketIo){
                        consumer.getCasparCommon().sendSocketIo('consumerEdit', consumer);
                    }
                    result.push(resolve);
                },function(reject){
                    result.push(reject);
                }
            )
            return result;
    }

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
                case 'fileName' : {
                    this.setFileName(value);
                    result[setting] = this.getFileName();
                }
                break;
                case 'filePath' : {
                    this.setFilePath(value);
                    result[setting] = this.getFilePath();
                }
                break;
                default : {
                    result[setting] = "not found";
                }
            }
        }

        return result;
    }

    getFileName(){return this.fileName;}
    setFileName(fileName){this.fileName = fileName;}

    getFilePath(){return this.filePath;}
    setFilePath(filePath){this.filePath = filePath;}

    setFrames(frames){
        this.frames = frames;
        if (this.frameRate){
            this.formattedDuration = this.timeFormat(this.frames, this.frameRate);
            if( Date.now() - this.lastUpdate > 120){
                this.getCasparCommon().sendSocketIo('recorderEdit', this);
                this.lastUpdate = Date.now();
            }
        }
    }

    getFrameRate(){ return this.frameRate; }
    setFrameRate(frameRate){this.frameRate = frameRate; }


    getCurrentRecordName () { return this.currentRecordName; }
    setCurrentRecordName () { 
        let date = new Date();
            date = date.toISOString().replace(/-/g,'').replace('T','_').replace(/:/g,'').replace('.','').replace('Z','');
            if (this.fileName != ''){
                this.currentRecordName = `${date}_${this.fileName}`;
            }else{
                this.currentRecordName = `${this.filePath}/${date}_${this.fileName}`;
            }
            
    }

}

module.exports = CasparConsumerFILE;