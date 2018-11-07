"use strict";

class CasparMedia {

    constructor(settings){
        CasparMedia.totalInstances = (CasparMedia.totalInstances || 0) + 1;
        this.id = CasparMedia.totalInstances;
        this.name = settings['name'] || 'default';
        this.label = settings['label'] || this.name;
        this.path = settings['path'] || '';
        this.fullPath = `${this.path}/${this.name}`;
        this.mediaType = settings['mediaType'] || null;
        this.size = settings['size'] || null;
        this.lastModification = settings['lastModification'] || null;
        this.frameNumber = settings['frameNumber'] || null;
        this.frameRate = settings['frameRate'] || null;
        this.duration = this.frameNumber*this.frameRate;
        this.formattedDuration = this.timeFormat(this.frameNumber,this.frameRate);
        this.formattedSize = this.sizeFormat(this.size);
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
        let hours = Math.floor(duration / 3600);
        let brutMinutes = (brutHours - hours) * 60;
        let minutes = Math.floor(brutMinutes);
        let brutSeconds = (brutMinutes - minutes) *60;
        let seconds = Math.floor(brutSeconds);
        let frames = Math.round((brutSeconds - seconds) / frameRate);
        // let frames = frameNb - (seconds + 60*minutes + 3600*hours)/frameRate;

        return `${('0'+hours).slice(-2)}:${('0'+minutes).slice(-2)}:${('0'+seconds).slice(-2)}:${('0'+frames).slice(-2)}`;
    }

    /**
     * Take an octet size integer and return a human readable String
     * @param {*} size size in otcet
     * @return {String} the human readable string
     */
    sizeFormat(size){

        const units = ['octets','ko','Mo','Go','To']; 
        let count = 0;
        while (size > 1*Math.pow(10,3*count) && count < 5) {
            count++;
            size = size/1000;
        }
        size = Math.round(size*100)/100;
        return `${size} ${units[count]}`;
    }

    clean() {
        const copy = Object.assign({}, this);
        return copy;
    
    }

    getId(){ return this.id; }

    getName() { return this.name; }
    setName(name) { this.name = name; }

    getLabel() { return this.label; }
    setLabel(label) { this.label = label;}

    getPath() { return this.path;}
    setPath(path) { this.path = path;}

    getFullPath() { return this.fullPath;}
    setFullPath(fullPath) { this.fullPath = fullPath; }

    getMediaType() { return this.mediaType;}
    setMediaType(mediaType) { this.mediaType = mediaType;}
    
    getSize () { return this.size;}
    setSize (size) { this.size = size}

    getLastModification () { return this.lastModification; }
    setLastModification (lastModification) { this.lastModification = lastModification}

    getFrameNumber () { return this.frameNumber }
    setFrameNumber (frameNumber) { this.frameNumber = frameNumber;}

    getFrameRate () { return this.frameRate}
    setFrameRate (frameRate) { this.frameRate = frameRate}
}

module.exports = CasparMedia;