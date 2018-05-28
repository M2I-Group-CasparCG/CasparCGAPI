"use strict";

const CasparMedia = require('./CasparMedia.js');

class CasparPlaylist {

    constructor(settings){
        CasparPlaylist.totalInstances = (CasparPlaylist.totalInstances || 0) + 1;
        this.id = CasparPlaylist.totalInstances;
        this.name = settings['name'] || 'defaultPlaylist'+this.id;
        this.list = new Array();
    }

    addMedia (media){
       
        if (media instanceof CasparMedia) {
            this.list.push(media);
            return this.list;
        }else{
            return false;
        }
    }

    insertMedia (media, index){
        if (media instanceof CasparMedia){
            this.list.splice(index, 0, media);
            return this.list;
        }else{
            return false;
        }
       
    }

    removeMedia (mediaIndex){

        if (this.list[mediaIndex] != null){
            this.list.splice(mediaIndex, 1);
            return this.list;
        }else{
            return false;
        }
    }

}

module.exports = CasparPlaylist;