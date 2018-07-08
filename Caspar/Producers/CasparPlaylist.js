"use strict";

const CasparMedia = require('./CasparMedia.js');

class CasparPlaylist {

    constructor(settings){
        CasparPlaylist.totalInstances = (CasparPlaylist.totalInstances || 0) + 1;
        this.id = CasparPlaylist.totalInstances;
        this.name = settings['name'] || 'defaultPlaylist'+this.id;
        this.list = new Array();
        this.casparCommon = settings['casparCommon'] || null;
    }


    /**
     * Adding a media to a playlist
     * @param {*} mediaId id of the media instance
     * @return {*} False | the matched media instance
     */
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
    }

    /**
     *  Insert a media at a specific index
     * @param {*} media the media instance to be added
     * @param {*} index the index where the media needs to be added
     * @return {*} the edit list or false if error
     */
    insertMedia (media, index){
        // console.log(media);
        // console.log(index);
        if (media instanceof CasparMedia){
            this.list.splice(index, 0, media);
            return this.list;
        }else{
            return false;
        }
    }

    /**
     * Get the media at a specific index
     * @param {*} index 
     * @return the media instance
     */
    getMedia (index)  {
        if(this.list[index]){
            return this.list[index];
        }else{
            return false;
        }
    }

    /**
     * Remove a media at a specific index
     * @param {*} mediaIndex the index where is the media to be deleted
     * @return the edited list or false if there is an error
     */
    removeMedia (mediaIndex){

        if (this.list[mediaIndex] != null){
            this.list.splice(mediaIndex, 1);
            return this.list;
        }else{
            return false;
        }
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


    /**
     * Getters / setters
     */
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