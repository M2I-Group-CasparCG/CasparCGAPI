

"use strict";

const fs =              require('fs');

var CasparCommon =      require('./CasparCommon.js');
var Channel =           require('./CasparChannel');
var ChannelMultiview =  require('./CasparChannelMultiview.js');
var Layer =             require('./CasparLayer');

var Producer =          require('./Producers/CasparProducer.js');
var ProducerDdr =       require('./Producers/CasparProducerDdr.js');
var ProducerDecklink =  require('./Producers/CasparProducerDecklink.js');
var ProducerFile =      require('./Producers/CasparProducerFile.js');
var ProducerNet =       require('./Producers/CasparProducerNet.js');

const Media =           require('./Producers/CasparMedia.js');
const Playlist =        require('./Producers/CasparPlaylist.js');

const Consumer =          require('./Consumers/CasparConsumer.js');
var ConsumerScreen =    require('./Consumers/CasparConsumerScreen.js');
var ConsumerFile =      require('./Consumers/CasparConsumerFile.js');
var ConsumerNet =       require('./Consumers/CasparConsumerNet.js');

var appRoot =           require('app-root-path');

var XMLHelper =         require(appRoot + '/XMLHandler/bin/xmlhelper.js');
var dgram =             require('dgram');

var onlineTimeout = null;

class Caspar {

    /**
     * CasparCG Constructor
     * @param {Array} settings All the CasparCG Settings
     * ['name'] Displayed name of the caspar instance
     * ['ipAddr'] IP Address of the caspar server
     * ['amcpPort'] AMCP port of the caspar server
     * ['oscDefaultPort'] OSC port of the caspar server
     * ['oscPredefinedClient'] Tuple : client IP address and client port
     * ['logLevel'] Log level of the caspar server
     * ['mediaPath'] Media path of the caspar server
     * ['logPath'] Log path of the caspar server
     * ['templatePath'] Template path of the caspar server
     * ['thumbnailsPaths'] Thumbnails path of the caspar server
     */

    constructor (settings) {
        Caspar.totalInstances = (Caspar.totalInstances || 0) + 1;
        this.object = 'Caspar';
        this.producers = new Map();                         // Map contenant les différents producers disponibles sur le serveur
        this.consumers = new Map();                         // Map contenant les différents consumers disponibles sur le serveur
        this.channels = new Map();                          // Map contenant les différents channels disponibles sur le serveur
        this.layers = new Map();
        this.playlists = new Map();
        this.medias = new Map();
        this.id = Caspar.totalInstances;                    // Incrémentation pour ID unique
        settings['id'] = this.id;
        settings['medias'] = this.medias;
        this.casparCommon = new CasparCommon(settings);     // création d'un objet CasparCommon, commun entre tous les élements (partage de mémoire)
        
        this.getInfo();
        
    }  


    /** 
     * initialise le serveur
     * Instanciation des channels PGM PVW et MULTIVIEW
     * Si des producers, channels ou consumer sont déjà configurés, les applique.
    */
    async ini(){     
        console.log('ini');
        // if( this.getCasparCommon().getMvId() == null){  // vérification que le channel n'est pas déjà init
            let mvSettings = new Array();
                mvSettings['name'] = 'MVW';
                mvSettings['id'] = 1;
            let mv = new ChannelMultiview(mvSettings,this.producers)
            this.addChannel(mv);
            this.casparCommon.setMvId(mv.getId());
        // }else{
            // let mv = this.channels.get(this.getCasparCommon().getMvId());
            // console.log(mv.id);
            if (mv instanceof ChannelMultiview){
                mv.ini(null);
            }
         
        // }

        // if( this.getCasparCommon().getPgmId() == null){     // vérification que le channel n'est pas déjà init
            let pgmSettings = new Array();
            pgmSettings['name'] = 'PGM';
            pgmSettings['id'] = 2;
            let pgm = new Channel(pgmSettings);
            this.addChannel(pgm);
            this.casparCommon.setPgmId(pgm.getId());
        // }
        
        // if( this.getCasparCommon().getPvwId() == null){ // vérification que le channel n'est pas déjà init
            let pvwSettings = new Array();
            pvwSettings['name'] = 'PVW';
            pvwSettings['id'] = 3;
            let pvw = new Channel(pvwSettings);
            this.addChannel(pvw);
            this.casparCommon.setPvwId(pvw.getId());
        // }
    }

    /**
     * Retrieving informations form the casaparCG server
     */
    async getInfo() {

        const casparCommon = this.getCasparCommon();
        const caspar = this;

        if (this.getCasparCommon().getOnline()){
            // récupération des informations.
            console.log('retrieving informations from the server...');
            await this.getCasparCommon().tcpPromise('VERSION')
                    .then(
                        function(resolveResult){
                            casparCommon.setCasparVersion(resolveResult['data']);
                        },  
                        function(rejectResult){
                            console.log(rejectResult);
                        }
                    )
        

            await this.getCasparCommon().tcpPromise('INFO')
            .then(
                function(resolveResult){
                    casparCommon.setChannelsNb(resolveResult['dataLines']);
                    resolveResult['data'].forEach(element => {
                        element = element.split(' ');
                        let settings = new Array();
                            console.log(parseInt(element[0]));
                            settings['id'] = parseInt(element[0]);
                            settings['name'] = 'default';
                            settings['videoMode'] = element[1];
                            settings['state'] = element[2];
                        let channel = new Channel(settings);
                        caspar.addChannel(channel);
                    });
                    
                },  
                function(rejectResult){
                    console.log(rejectResult);
                    
                }
            )

            await this.getCasparCommon().tcpPromise('INFO CONFIG')
                .then(
                    function(resolveResult){
                        const xmlHandler = new XMLHelper(resolveResult['data']);
                            casparCommon.setOscDefaultPort(parseInt(xmlHandler.getOSCPortValue()))
                           
                    },  
                    function(rejectResult){
                        console.log(rejectResult);
                    }
                )
                .catch(function(error){
                    console.log(error);
                });

            await this.getCasparCommon().tcpPromise('INFO PATHS')
                .then(
                    function(resolveResult){
                        const xmlHandler = new XMLHelper(resolveResult['data']);
                        casparCommon.setCasparPath(xmlHandler.getXMLValue('initial-path'));
                        casparCommon.setThumbnailsPath(xmlHandler.getXMLValue('thumbnail-path'));
                        casparCommon.setTemplatePath(xmlHandler.getTemplatePathValue());
                        casparCommon.setLogPath(xmlHandler.getLogPathValue());
                        casparCommon.setMediaPath(xmlHandler.getMediaPathValue());
                    },  
                    function(rejectResult){
                        console.log(rejectResult);
                    }
                )
                .catch(function(error){
                    console.log(error);
                });

            await this.getCasparCommon().tcpPromise('INFO SYSTEM')
            .then(
                function(resolveResult){
                    // console.log(resolveResult['data']);
                    // console.log(resolveResult['data']);
                    const xmlHandler = new XMLHelper(resolveResult['data']);
                    let resultArray = xmlHandler.getDecklinkValue().split(' ').join('').split('\n');
                    casparCommon.setDecklinkCards([]);
                    for(let n in resultArray){
                        const element = resultArray[n];
                        if (element.indexOf('DeckLink') > -1){
                            const index = parseInt(element.split('[')[1].replace(']',''));
                            casparCommon.setDecklinkCard(index, element);
                        }   
                    }   
                    /**
                     * Récupération des élements
                     * name
                     * os -> description
                     * 
                     */
                },  
                function(rejectResult){
                    console.log(rejectResult);
                }
            )

            await this.scanMedias();
            this.ini();
            // this.getCasparCommon().sendSocketIo('casparAdd',this);

        }else{
            this.getCasparCommon().sendSocketIo('casparAdd',this);
        }        
    }

    /**
     * Multiple settings edition
     * @param {Array} settings key : setting to edit, value : value to apply to the setting
     */
    edit(settings){
        let result = new Object();
        for (let setting in settings){
            let response =  this.getCasparCommon().edit(setting, settings[setting]);
            for (let key in response){
                result[key] = response[key];
            }
        }
        return result;
    }

    /**
     * Mutliple settings edition for caspar's objects 
     * @param {Array} settings  key : setting to edit, value : value to apply to the setting
     * @param {Object} object Object to edit (Producer, Consumer, Channel, Layer)
     */
    editObject(settings, object){
        let result = new Object();
        for (let setting in settings){
            // console.log(object);
            let response =  object.edit(setting, settings[setting]);
            for (let key in response){
                // console.log(response);
                result[key] = response[key];
            }
        }
        return result;
    }

    /**
     * Add a channel
     * @param {Channel} channel 
     */
    addChannel (channel) {
        if (channel instanceof Channel){
            channel.setCasparCommon(this.casparCommon);
            this.channels.set(channel.getId(),channel);
            return true;
        }else{
            return false;
        }
    }

    /**
     * Get a channel by id
     * @param {int} channelId id of the channel to get.
     */
    getChannel (channelId) {
        return this.channels.get(channelId);
    }

    /**
     * Suppression d'un channel du serveur CasaprCG
     * Modification du nombre de channel dans le fichier caspar.config
     * Nécessité un redémarrage de l'application casparCG pour pouvoir être appliquée
     * @param {int} channelId Nom du channel à supprimer de CasparCG
     * @return {Channel | boolean} Retourne le channel supprimé, retourne false si le channel n'a pas été supprimé. 
     */
    removeChannel (channelId) {
        var channel = this.channels.get(channelId);
        if (channel instanceof Channel) {
            this.channels.delete(channelId);
            return channel;
        }else{
            return false
        }

    }

    /** 
     * @return {map} Map contenant les channels
    */
    getChannels () {
        return this.channels;
    }


    /**
     * Ajout d'un produceur au serveur CasparCG
     * @param {Producer} producer producer à ajouter
     */
    addProducer (producer) {
        if (producer instanceof Producer){
            producer.setCasparCommon(this.casparCommon);
            if (producer.getType() == 'DDR'){
                let settings = new Array();
                    settings['casparCommon'] = this.getCasparCommon();
                let playlist = new Playlist(settings);
                producer.setPlaylist(playlist);
                this.playlists.set(playlist.getId(), playlist);

            }
            this.producers.set(producer.getId(), producer);
            if (this.getCasparCommon().getMvId()){
                console.log('_______');
                console.log(this.getCasparCommon().getMvId());
                console.log(this.channels.get(this.getCasparCommon().getMvId()));
                this.channels.get(this.getCasparCommon().getMvId()).ini(this.producers);
            }
            if (this.getCasparCommon().getOnline()){
                producer.run();
            }
            return true;
        }else{
            return false;
        }
    }

    /**
     * 
     * @param {int} producerId ID du producer à récupérer
     */
    getProducer (producerId) {
        return this.producers.get(producerId);
    }

    /**
     * Suppression d'un producer du serveur CasparCG
     * @param {int} producerId Nom du producer à supprimer 
     */
    removeProducer (producerId) {
        var producer = this.producers.get(producerId);
        if (producer instanceof Producer) {
            producer.stop(false);
            this.producers.delete(producerId);
            if (this.getCasparCommon().getMvId()){
                this.channels.get(this.getCasparCommon().getMvId()).ini(this.producers);
            }
            return producer;
        }else{
            return false
        }
    }

    /** 
     * @return {Map}  
    */
    getProducers () {
        return this.producers;
    }

    /**
     * 
     * @param {Consumer} consumer
     */
    addConsumer (consumer) {
        if(consumer instanceof Consumer){
            consumer.setCasparCommon(this.casparCommon);
            this.consumers.set(consumer.getId(), consumer);
            const caspar = this;
            if (this.getCasparCommon().getOnline()){
                consumer.run();
            }
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * 
     * @param {int} consumerId 
     */
    getConsumer (consumerId) {
        return this.consumers.get(consumerId);
    }

    /**
     * 
     * @param {int} consumerId 
     */
    removeConsumer (consumerId) {
        var consumer = this.consumers.get(consumerId);
        if (consumer instanceof Consumer) {
            this.consumers.delete(consumerId);
            consumer.stop(false);
            return consumer;
        }else{
            return false
        }
    }

    /** 
     * 
    */
    getConsumers () {
        return this.consumers;
    }


    /**
     * LAYERS
     */

    /**
     * Create a new layer instance
     * Required setting : settings['channelId'] = (int) channelId   // must be an existing channel
     * @param {Array} settings
     * @return {}
     */
    addLayer (settings) {
        settings['casparCommon'] = this.getCasparCommon();
        let layer = new Layer(settings);
        this.layers.set(layer.getId(), layer);
        const channelId = layer.getChannelId();
        const channel = this.getChannel(channelId);
    
        if (channel instanceof Channel){
            return this.getChannel(channelId).addLayer(layer);      // ajout du layer au channel
        }else{
            return layer;
        }
    }

    /**
     * 
     * @param {int} layerId 
     */
    removeLayer (layerId){ 

        let layer = this.layers.get(layerId);
        let channel = this.channels.get(layer.getChannelId());

        if (channel instanceof Channel ){
            this.layers.delete(layerId);
            return channel.removeLayer(layerId);
        }else{
            return this.layers.delete(layerId);
        }
    }

    /**
     * 
     * @param {int} layerId 
     */
    getLayer (layerId){
        if (this.layers.get(layerId) instanceof Layer){
            return this.layers.get(layerId);
        }else{
            return false;
        }
    }

    /**
     * 
     */
    getLayers (){
        return this.layers;
    }

    /**
    * PLAYLIST
    */

    addPlaylist (settings) {
        settings['casparCommon'] = this.getCasparCommon();
        let playlist = new Playlist(settings);
        
        this.playlists.set(playlist.getId(), playlist);

        return playlist;
    }

    getPlaylist (id){
        if (this.playlists.get(id) instanceof Playlist){
            return this.playlists.get(id) ;
        }else{
            return false;
        }
    }

    getPlaylists(){
        return this.playlists;
    }

    removePlaylist(id) {
        let playlist = this.playlists.get(id);
        if (playlist instanceof Playlist){
            this.playlists.delete(id);
            return playlist;
        }else{
            return false;
        }
    }
    /**
     * MEDIAS
     */

    getMedia(mediaId){
        let result = null;
        this.medias.forEach(media => {
            if (media.getId() == mediaId){
                result = media;
            }
        });
        return result;
    }
    getMedias () { 
        return this.medias;
    }

    async scanMedias () {
        const medias = this.medias;
        const caspar = this;
        await this.getCasparCommon().tcpPromise('CLS')
            .then(
                function(resolveResult){
                    const fileList = resolveResult['data'];
                          fileList.forEach(function(file) {
                    
                        const settings = new Array();
                        const fileInfo = file.split(' ');
                        
                        /**
                         * The indexes of the different media information in the CLS command return
                         */
                        const indexes = new Object();
                        if (caspar.getCasparCommon().getCasparVersion() == '2.2.0 3c77a837 Beta 1'){
                            indexes.path = 0;
                            indexes.mediaType = 2;
                            indexes.size = 4;
                            indexes.lastModification = 5;
                            indexes.frameNumber = 6;
                            indexes.frameRate = 7;
                        }else{
                            indexes.path = 0;
                            indexes.mediaType = 1;
                            indexes.size = 2;
                            indexes.lastModification = 3;
                            indexes.frameNumber = 4;
                            indexes.frameRate = 5;
                        }
                        const fullPath = fileInfo[indexes.path].replace(/"/g,'');

                        const splittedPath = fullPath.split('/');
                        settings['name'] = splittedPath.pop();
                        settings['path'] = splittedPath.join('/');
                        
                        settings['mediaType'] = fileInfo[indexes.mediaType];
                        settings['size'] = parseInt(fileInfo[indexes.size]);
                        settings['lastModification'] = parseInt(fileInfo[indexes.lastModification]);
                        settings['frameNumber'] = parseInt(fileInfo[indexes.frameNumber]);
                        if(fileInfo[indexes.frameRate]){
                            const frameRate = parseInt(fileInfo[indexes.frameRate].split('/')[0])/parseInt(fileInfo[indexes.frameRate].split('/')[1]);
                            settings['frameRate'] = frameRate;
                        }
                        const media = new Media(settings);
                        medias.set(media.getFullPath(),media);              
                    });
                },  
                function(rejectResult){
                    console.log(rejectResult);
                }
            )
    }



    /**
     * Restart the casparCG server
     * @return {Promise} tcpPromise with a JSON message (success or error description)
     */
    restart () {
        const req = 'RESTART';
        const caspar = this;
        this.getCasparCommon().setMvId(null);
        this.getCasparCommon().setPgmId(null);
        this.getCasparCommon().setPvwId(null);
        setTimeout(
            function(){
                caspar.getInfo();
            },  
            2000
        )
        return this.tcpPromise(req);
    }

    /**
     * Envoi d'un requête TCP au serveur CasparCG
     * @param {string} msg  
     * @param {function} callback 
     */
    tcpSend (msg, callback) {
        this.casparCommon.tcpSend(msg, callback);
    }

   

    /**
     * Analyze OSC message and update the caspar instance according to the result.
     * @param {String} oscData 
     * @return {Object} the object describing the OSC information analyzed 
     */
    oscAnalyzer(oscData){        

        clearTimeout(onlineTimeout);
        if (! this.getCasparCommon().getOnline()){
            this.getCasparCommon().setOnline(true);
            this.getInfo();
            this.getCasparCommon().sendSocketIo('casparEdit',this);
        }
        
        this.startOnlineTimeout();
        
        let caspar = this;

        const reChannelFormat                       = /\/channel\/\d{1,3}\/format/;
        const reChannelLayerFilePath                = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/file\/path/;
        const reChannelLayerLoop                    = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/loop/;
        const reChannelLayerPaused                  = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/paused/;
        const reChannelLayerFileTime                = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/file\/time/;
        const reChannelLayerFileFrame               = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/file\/frame/;
        const reChannelLayerFileFps                 = /\/channel\/\d{1,3}\/stage\/layer\/\d{1,3}\/file\/fps/;

        const reChannelMixerAudioChannelsnb         = /\/channel\/\d{1,3}\/mixer\/audio\/nb_channels/;
        const reChannelMixerAudioDbfs               = /\/channel\/\d{1,3}\/mixer\/audio\/\d{1,3}\/dBFS/;

        const reChannelOutputRecord                 = /\/channel\/\d{1,3}\/output\/port\/200\//;
        const reChannelOutputRecordFrame            = /\/channel\/\d{1,3}\/output\/port\/200\/frame/;
        const reChannelOutputRecordPath             = /\/channel\/\d{1,3}\/output\/port\/200\/path/;
        const reChannelOutputRecordFps              = /\/channel\/\d{1,3}\/output\/port\/200\/fps/;

        const reChannelOutputRecordType             = /\/channel\/\d{1,3}\/output\/port\/200\/type/;

        let returnVal = null;

        // console.log(oscData.keys().next().value);
        const firstKey = oscData.keys().next().value;

        if(firstKey){
        //    console.log('_______________');
        // console.log(oscData);
            // dans le cas d'un message de rec
        if(firstKey.match(reChannelOutputRecord)){
            const messageType = 'recordInfo';
            const recInfo = new Object();
            oscData.forEach(function(value, key, map){
                if(key.match(reChannelOutputRecordFrame)){
                    recInfo.frame = value;
                }else if (key.match(reChannelOutputRecordPath)){
                    recInfo.path = value;
                }else if (key.match(reChannelOutputRecordFps)){
                    recInfo.fps = 1/parseInt(value);
                }
            });
            let recorder = false;
            if (recInfo.frame && recInfo.path){ //if the record is detected

                for (let consumer of this.consumers.values()){
                    let consumerFullPath = consumer.fileName;
                    if (consumer.filePath != ""){
                        consumerFullPath = consumer.filePath+consumer.fileName;
                    }
                    if (consumerFullPath == recInfo.path){
                       recorder = consumer;
                       if (recorder.getFrameRate() != recInfo.fps){
                           recorder.setFrameRate(recInfo.fps);
                       }
                       recorder.setFrames(recInfo.frame)
                    //    return ['recorderEdit', recorder];
                    }
                };
               
            }
        }
        for (let [key, value] of oscData){
            if (key.match(reChannelLayerFilePath)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                const producer = this.getProducer(layerNb);
                if (channelNb == 1){
                    if (producer instanceof ProducerDdr){
                        let array = value.split('.');
                        array.pop();
                        let mediaName = '/'+array.join().toUpperCase();
                    }
                }
            }else if (key.match(reChannelLayerPaused)){
               
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                if (channelNb == 1){
                    const producer = this.getProducer(layerNb);
                    if (producer instanceof ProducerDdr){
                    }
                }
            }else if (key.match(reChannelLayerFileTime)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                if (channelNb == 1){
                    if (this.getProducer(layerNb) instanceof ProducerDdr){
                        let old_index = this.getProducer(layerNb).getCurrentIndex();
                        this.getProducer(layerNb).setFileTime(value);        
                        // return ['ddrEdit', this.getProducer(layerNb)];
                    }
                }
            }else if (key.match(reChannelLayerFileFrame)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                if (channelNb == 1){
                    if (this.getProducer(layerNb) instanceof ProducerDdr){                
                        if (value.indexOf('|')>-1){
                            value = value.split('|')[0];
                        }else{
                        value = 0;
                        }
                        this.getProducer(layerNb).setCurrentFileFrame(parseInt(value));
                        // return ['ddrEdit', this.getProducer(layerNb)];
                    }
                }
            }
        }

        }

        // oscData.forEach(function(value, key, map){

        // }


        // if (oscData.key().next().val)

        // oscData.forEach(function(value, key, map){
            
        //     if ( key.match(reChannelFormat)){
        //         const channelNb = parseInt(key.match(/\d{1,3}/)[0]);
        //         if (caspar.getChannels().get(channelNb) instanceof Channel ){
        //             caspar.getChannels().get(channelNb).setVideoMode(value);
        //         }
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerLoop)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerPaused)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerFileTime)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerFileFrame)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerFileFps)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelLayerFilePath)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const layerNb = parseInt(result[1]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelMixerAudioChannelsnb)){
        //         const channelNb = parseInt(key.match(/\d{1,3}/)[0]);
        //         returnVal = null;
        //     }else if ( key.match(reChannelMixerAudioDbfs)){
        //         const result = key.match(/\d{1,3}/g);
        //         const channelNb = parseInt(result[0]);
        //         const audioChannelNb = parseInt(result[1]);
        //         if (caspar.getChannels().get(channelNb) instanceof Channel ){
        //             caspar.getChannels().get(channelNb).setAudioLevel(audioChannelNb, value);
        //         }
        //         let state = new Object();
        //             state.type = 'audioLevel';
        //             state.casparId = caspar.getCasparCommon().getId();
        //             state.channelId = channelNb;
        //             state.audioChannelNb = audioChannelNb;
        //             state.audioLevel = value;
        //         returnVal =  state;
            
        //     /**
        //      * RECORD
        //      */
        //     }elseif (key.match(reChannelOutputRecord)){
                
        //     }
            
            
            
            
        //     else{
        //         returnVal = null;
        //     }
        // });
        
    }


    startOnlineTimeout(){
        const caspar = this;
        onlineTimeout = setTimeout(
            function(){
                caspar.getCasparCommon().setOnline(false);
            },
            100);
    }

    /**
     *   Getters / Setters
     */

    getCasparCommon(){ return this.casparCommon; }
    
    setCasparCommon(casparCommon){ this.casparCommon = casparCommon; }
    
    tcpPromise(req){ return this.getCasparCommon().tcpPromise(req); }

    getId(){ return this.id; }


}

module.exports = Caspar;
