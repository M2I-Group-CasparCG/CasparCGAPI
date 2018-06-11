"use strict";

class CasparMedia {

    constructor(settings){
        CasparMedia.totalInstances = (CasparMedia.totalInstances || 0) + 1;
        this.id = CasparMedia.totalInstances;
        this.name = settings['name'] || null;
        this.label = settings['label'] || this.name;
        this.path = settings['path'] || null;
        this.mediaType = settings['mediaType'] || null;
        this.size = settings['size'] || null;
        this.lastModification = settings['lastModification'] || null;
        this.frameNumber = settings['frameNumber'] || null;
        this.frameRate = settings['frameRate'] || null;
    }

    getId(){
        return this.id;
    }
}

module.exports = CasparMedia;