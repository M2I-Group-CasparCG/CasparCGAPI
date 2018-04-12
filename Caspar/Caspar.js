"use strict";

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
        this.XmlHandler = new XMLHelper(appRoot + '/utilities/API/caspar.config'); // Création de l'objet qui gère le fichier de config
        this.casparCommon = new CasparCommon(this.XmlHandler.getSettingsArray());     // création d'un objet CasparCommon, commun entre tous les élements (partage de mémoire)
    }  


    /** 
     * initialise le serveur
     * Instanciation des channels PGM PVW et MULTIVIEW
    */
    ini(){     

        if( this.getCasparCommon().getMvId() == null){  // vérification que le channel n'est pas déjà init
        let pgmSettings = new Array();
            let mvSettings = new Array();
            mvSettings['name'] = 'MVW';
            let mv = new ChannelMultiview(mvSettings,this.producers)
            this.addChannel(mv);
            this.casparCommon.setMvId(mv.getId());
            mv.ini();
        }else{
            let mv = this.channels.get(this.getCasparCommon().getMvId());
            mv.ini();
        }

        if( this.getCasparCommon().getPgmId() == null){     // vérification que le channel n'est pas déjà init
            let pgmSettings = new Array();
            pgmSettings['name'] = 'PGM';
            let pgm = new Channel(pgmSettings);
            this.addChannel(pgm);
            this.casparCommon.setPgmId(pgm.getId());
        }

        
        if( this.getCasparCommon().getPvwId() == null){ // vérification que le channel n'est pas déjà init
        let pgmSettings = new Array();
            let pvwSettings = new Array();
            pvwSettings['name'] = 'PVW';
            let pvw = new Channel(pvwSettings);
            this.addChannel(pvw);
            this.casparCommon.setPvwId(pvw.getId());
        }

        



    }

    /**
     * Ajout d'un channel au serveur CasaprCG
     * Modification du nombre de channel dans le fichier caspar.config
     * Nécessité un redémarrage de l'application casparCG pour pouvoir être appliquée
     * @param {Channel} channel Paramètres du channel à ajouter
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
            this.tcpSend(producer.remove(),function(){});
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

}

module.exports = Caspar;
