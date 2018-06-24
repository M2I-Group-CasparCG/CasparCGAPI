"use strict";

class CasparMedia {

    constructor(settings){
        CasparMedia.totalInstances = (CasparMedia.totalInstances || 0) + 1;
        this.id = CasparMedia.totalInstances;
        this.name = settings['name'] || null;
        this.label = settings['label'] || this.name;
        this.path = settings['path'] || '';
        this.fullPath = `${this.path}/${this.name}`;
        this.mediaType = settings['mediaType'] || null;
        this.size = settings['size'] || null;
        this.lastModification = settings['lastModification'] || null;
        this.frameNumber = settings['frameNumber'] || null;
        this.frameRate = settings['frameRate'] || null;
        this.duration = this.timeFormat(this.frameNumber,this.frameRate);
        this.formattedSize = this.sizeFormat(this.size);
    }

    timeFormat(frameNb, frameRate){

        let duration = frameNb*frameRate;
        let seconds = (duration-duration % 1) % 60 ;
        let minutes = (duration - duration % 60) / 60;
        let hours = (duration - duration % 3600) / 3600;
        let frames = frameNb - (seconds + 60*minutes + 3600*hours)/frameRate;

        return `${hours}:${minutes}:${seconds}:${frames}`;
    }


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