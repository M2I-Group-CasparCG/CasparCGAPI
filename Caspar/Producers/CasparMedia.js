"use strict";

class CasparMedia {

    constructor(settings){
        CasparMedia.totalInstances = (CasparMedia.totalInstances || 0) + 1;
        this.id = CasparMedia.totalInstances;
        this.name = settings['name'] || null;
        this.label = settings['label'] || 'media'+this.id;
        this.path = settings['path'] || null;
    }

}

module.exports = CasparMedia;