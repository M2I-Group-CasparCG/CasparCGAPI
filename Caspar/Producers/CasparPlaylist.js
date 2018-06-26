"use strict";

const CasparMedia = require('./CasparMedia.js');

class CasparPlaylist {

    constructor(settings){
        CasparPlaylist.totalInstances = (CasparPlaylist.totalInstances || 0) + 1;
        this.id = CasparPlaylist.totalInstances;
        this.name = settings['name'] || 'defaultPlaylist'+this.id;
        this.list = new Array();
        this.casparCommon = settings['casparCommon'] || null;
        this.currentIndex = 0;
    }

    addMedia (mediaId){
        let matchedMedia = false;
        let medias = this.getCasparCommon().getMedia();
        medias.forEach(media => {
            if (media.getId() == mediaId){
                matchedMedia = media;
            }
        });

        if (matchedMedia){

            this.list.push(matchedMedia);
        }
        return matchedMedia;
        // if (media instanceof CasparMedia) {
        //     this.list.push(media);
        //     return this.list;
        // }else{
        //     return false;
        // }
    }

    insertMedia (media, index){
        if (media instanceof CasparMedia){
            this.list.splice(index, 0, media);
            return this.list;
        }else{
            return false;
        }
       
    }

    getMedia (index)  {
        if(this.list[index]){
            return this.list[index];
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

    edit(setting, value){
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'list' : {
                this.setList(value);
                response[setting] = this.getList();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
        return response;
    }

    getId(){ return this.id;}
    setId(id) { this.id = id;}

    getName () { return this.name}
    setName(name) {this.name = name;}

    getList () { return this.list;}
    setList (list) { this.list = list;}

    getCasparCommon() { return this.casparCommon;}
    setCasparCommon (casparCommon){ this.casparCommon = casparCommon;
   }
}

module.exports = CasparPlaylist;