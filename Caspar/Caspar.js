

"use strict";

const fs =              require('fs');

var CasparCommon =      require('./CasparCommon.js');
var Channel =           require('./CasparChannel');
var ChannelMultiview =  require('./CasparChannelMultiview.js');

var Producer =          require('./Producers/CasparProducer.js');
var ProducerDdr =       require('./Producers/CasparProducerDdr.js');
var ProducerDecklink =  require('./Producers/CasparProducerDecklink.js');
var ProducerFile =      require('./Producers/CasparProducerFile.js');
var ProducerNet =       require('./Producers/CasparProducerNet.js');

var Consumer =          require('./Consumers/CasparConsumer.js');
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
     * ['name'] Nom unique du serveur Caspar
     * ['ipAddr'] Adresse IP du serveur
     * ['amcpPort'] Port AMCP du servur
     * ['oscDefaultPort'] Port OSC par défaut du serveur
     * ['oscPredefinedClient'] Tuple contenant l'IP et le port du client OSC prédéfini
     * ['logLevel'] Niveau de logs du serveur
     * ['mediaPath'] Emplacement du dossier Médias sur le serveur
     * ['logPath'] Emplacement du dossier Log sur le serveur
     * ['templatePath'] Emplacement du dossier Template sur le serveur
     * ['thumbnailsPaths'] Emplacement du dossier Thumbnails sur le serveur
     */

    constructor (settings) {
        Caspar.totalInstances = (Caspar.totalInstances || 0) + 1;
        this.producers = new Map();                         // Map contenant les différents producers disponibles sur le serveur
        this.consumers = new Map();                         // Map contenant les différents consumers disponibles sur le serveur
        this.channels = new Map();                          // Map contenant les différents channels disponibles sur le serveur
        this.id = Caspar.totalInstances;                    // Incrémentation pour ID unique
        settings['id'] = this.id;
        this.casparCommon = new CasparCommon(settings);     // création d'un objet CasparCommon, commun entre tous les élements (partage de mémoire)

      }  


    /** 
     * initialise le serveur
     * Instanciation des channels PGM PVW et MULTIVIEW
    */
    async ini(){     
    
        if( this.getCasparCommon().getMvId() == null){  // vérification que le channel n'est pas déjà init
            let mvSettings = new Array();
                mvSettings['name'] = 'MVW';
                mvSettings['id'] = 1;
            let mv = new ChannelMultiview(mvSettings,this.producers)
            this.addChannel(mv);
            this.casparCommon.setMvId(mv.getId());
            // mv.ini();
        }else{
            let mv = this.channels.get(this.getCasparCommon().getMvId());
            mv.ini();
        }

        if( this.getCasparCommon().getPgmId() == null){     // vérification que le channel n'est pas déjà init
            let pgmSettings = new Array();
            pgmSettings['name'] = 'PGM';
            pgmSettings['id'] = 2;
            let pgm = new Channel(pgmSettings);
            this.addChannel(pgm);
            this.casparCommon.setPgmId(pgm.getId());
        }
        
        if( this.getCasparCommon().getPvwId() == null){ // vérification que le channel n'est pas déjà init
        let pgmSettings = new Array();
            let pvwSettings = new Array();
            pvwSettings['name'] = 'PVW';
            pvwSettings['id'] = 3;
            let pvw = new Channel(pvwSettings);
            this.addChannel(pvw);
            this.casparCommon.setPvwId(pvw.getId());
        }
    }

    /**
     * Retrieving informations form the casaparCG server
     */
    async getInfo() {
        const casparId = this.id;
        const casparCommon = this.getCasparCommon();
        const caspar = this;
        

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
                    console.log(resolveResult['data']);
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


    
        }

    /**
     * Ajout d'un channel au serveur CasaprCG
     * Modification du nombre de channel dans le fichier caspar.config
     * Nécessité un redémarrage de l'application casparCG pour pouvoir être appliquée
     * @param {Channel} channel Paramètres du channel à ajouter
     */

    /**
     * Permet d'éditer plusieurs paramètres de Caspar
     * 
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

    editObject(settings, object){
        let result = new Object();
        for (let setting in settings){
            let response =  object.edit(setting, settings[setting]);
            for (let key in response){
                result[key] = response[key];
            }
        }
        return result;
    }

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
     * Retourne le channel demandé
     * @param {int} channelId Id du channel à retourner
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
            this.producers.set(producer.getId(), producer);
            this.channels.get(this.getCasparCommon().getMvId()).ini();
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
            this.producers.delete(producerId);
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
     * @param {*} consumer
     */
    addConsumer (consumer) {
        if(consumer instanceof Consumer){
            consumer.setCasparCommon(this.casparCommon);
            this.consumers.set(consumer.getId(), consumer);
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * 
     * @param {*} consumerId 
     */
    getConsumer (consumerId) {
        return this.consumers.get(consumerId);
    }

    /**
     * 
     * @param {*} consumerId 
     */
    removeConsumer (consumerId) {
        var consumer = this.consumers.get(consumerId);
        if (consumer instanceof Consumer) {
            this.consumers.delete(consumerId);
            this.tcpSend(consumer.remove(),function(){});
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
     * Envoi d'un requête TCP au serveur CasparCG
     * @param {string} msg  
     * @param {function} callback 
     */
    tcpSend (msg, callback) {
        this.casparCommon.tcpSend(msg, callback);
    }


    oscAnalyzer(oscData){

        
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

        clearTimeout(onlineTimeout);
        caspar.getCasparCommon().setOnline(true);

        let returnVal = null;

        oscData.forEach(function(value, key, map){

            if ( key.match(reChannelFormat)){
                const channelNb = parseInt(key.match(/\d{1,3}/)[0]);
                if (caspar.getChannels().get(channelNb) instanceof Channel ){
                    caspar.getChannels().get(channelNb).setVideoMode(value);
                }
                returnVal = null;
            }else if ( key.match(reChannelLayerFilePath)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                return null;
            }else if ( key.match(reChannelLayerLoop)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelLayerPaused)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelLayerFileTime)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelLayerFileFrame)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelLayerFileFps)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelLayerFilePath)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const layerNb = parseInt(result[1]);
                returnVal = null;
            }else if ( key.match(reChannelMixerAudioChannelsnb)){
                const channelNb = parseInt(key.match(/\d{1,3}/)[0]);
                returnVal = null;
            }else if ( key.match(reChannelMixerAudioDbfs)){
                const result = key.match(/\d{1,3}/g);
                const channelNb = parseInt(result[0]);
                const audioChannelNb = parseInt(result[1]);
                if (caspar.getChannels().get(channelNb) instanceof Channel ){
                    caspar.getChannels().get(channelNb).setAudioLevel(audioChannelNb, value);
                }
                let state = new Object();
                    state.type = 'audioLevel';
                    state.casparId = caspar.getCasparCommon().getId();
                    state.channelId = channelNb;
                    state.audioChannelNb = audioChannelNb;
                    state.audioLevel = value;
                returnVal =  state;
            }else{
                returnVal = null;
            }
        });

        onlineTimeout = this.startOnlineTimeout();
        return returnVal;
    }


    startOnlineTimeout(){
        const caspar = this;
        let timeout = setTimeout(
            function(){
                caspar.getCasparCommon().setOnline(false);
            },
            1000);
        return timeout;
    }

    /**
     *   Getters / Setters
     */
    
    getIpAddr () {
        return this.ipAddr;
    }
    setIpAddr (ipAddr) {
        this.casparCommon.ipAddr = ipAddr;
    }
    getName () {
        return this.name;
    }
    setName (name) {
        this.name = name;
    }
    getAmcpPort () {
        return this.amcpPort;
    }
    setAmcpPort (amcPort) {
        this.amcpPort = amcPort;
    }
    getOscPort () {
        return this.oscPort;
    }
    setOscPort (oscPort) {
        this.oscPort = oscPort;
    }
    getLogLevel () {
        return logLevel;
    }
    setLogLevel (logLevel) {
        this.logLevel = logLevel;
    }
    getCasparCommon(){
        return this.casparCommon;
    }
    setCasparCommon(casparCommon){
        this.casparCommon = casparCommon;
    }
    getId(){
        return this.id;
    }
    getUdpServerStarted(){
        return this.updServerStarted;
    }
    setUdpServerStarder(bool){
        this.updServerStarted = bool;
    }

}

module.exports = Caspar;
