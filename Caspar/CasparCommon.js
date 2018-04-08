var net = require('net');

class CasparCommon {

    /**
     * Allocation mémoire partagée par toutes les objets contenus dans CapsarCG
     * Contient les paramètres du serveurs, et les MAP menant à ses composants
     * Réalise aussi la communication AMCP et OSC avec le serveur
     * @param {Array} settings Array contenant les paramètres de l'objet 
     * ['name'] Nom unique du serveur Casapr
     * ['ipAddr'] Adresse IP du serveur
     * ['amcpPort'] Port AMCP du servur
     * ['oscDefaultPort'] Port OSC par défaut du serveur
     * ['oscPredefinedClient'] Tuple contenant l'IP et le port du client OSC prédéfini
     * ['logLevel'] Niveau de logs du serveur
     * ['mediaPath'] Emplacement du dossier Médias sur le serveur
     * ['logPath'] Emplacement du dossier Log sur le serveur
     * ['templatePath'] Emplacement du dossier Template sur le serveur
     * ['thumbnailsPaths'] Emplacement du dossier Thumbnails sur le serveur
     * ['producers'] =  Map contenant les différents producers disponibles sur le serveur
     * ['consumers'] =  Map contenant les différents consumers disponibles sur le serveur
     * ['channels'] =  Map contenant les différents channels disponibles sur le serveur
     */
    constructor(settings) {

        this.name = settings['name'] || new String();
        this.ipAddr = settings['ipAddr'] || '192.168.1.249';
        this.amcpPort = settings['amcpPort'] || 5250;
        this.oscDefaultPort = settings['oscDefaultPort'] || 6250;
        this.oscPredefinedClient = settings['oscPredefinedClient'] || new Array();
        this.logLevel = settings['logLevel'] || 0;
        this.mediaPath = settings['mediaPath'] || 'media';
        this.logPath = settings['logPath'] || 'log';
        this.templatePath = settings['templatePath'] || 'templates';
        this.thumbnailsPath = settings['thumbnailsPaths'] || 'thumbnails';
        this.pgmId = null;
        this.pvwId = null;
        this.mvId = null;
        this.online = false;
        this.socket = settings['socket'] || null;
        
    }

    /**
     * Permet d'envoyer une commande TCP au serveur
     * 
     * @param {String} msg message à envoyer au serveur
     * @param {Function} callback fonction de callback à exécuter lors de la réponse du serveur
     */
    tcpSend(msg,callback){
        var client = new net.Socket();
            
                client.connect(this.amcpPort, this.ipAddr, function() {
                    client.write(msg+'\r\n');
                    callback();
                }); 
        
                client.on('error', function(error){
                    console.log(error);
                });
            
                client.on('data', function(data) {
                    console.log(msg);
                    console.log(data.toString());
                    callback(data.toString());
                    // this.socket.emit('message','test');
                    client.destroy();
                });
    
            client.on('close', function() {
                console.log('');
            });

    }

    tcpPromise (msg){
        
        let client = new net.Socket();
            client.setTimeout(1000);

        let amcpPort = this.amcpPort;
        let ipAddr = this.ipAddr;


        return new Promise(function(resolve,reject){

            client.connect(amcpPort, ipAddr, function() {
                client.write(msg+'\r\n');
            }); 

            client.on('error', function(error){
                resolve('error');
            });

            client.on('timeout', function(error){
                console.log('timeout');
                resolve('timeout');
            });

            client.on('data', function(data) {
                console.log(msg);
                console.log(data.toString());
                resolve(data.toString());
                client.destroy();
            });

            client.on('close', function() {
                console.log('');
            });

        });

    }

    // socketSend (msg){
    //     this.socket.emit('message','test');
    // }

    /** 
     * Permet de générer le fichier caspar.conf
     */
   generateConfig () {

    }
    setPgmId(id){
        this.pgmId = id;
    }
    getPgmId(){
        return this.pgmId;
    }
    setPvwId(id){
        this.pvwId = id;
    }
    getPvwId(){
        return this.pvwId;
    }
    setMvId(id){
        this.mvId = id;
    }
    getMvId(){
        return this.mvId;
    }
    getOnline (){
        return this.online;
    }
    setOnline (online){
        this.online = online;
    }
    setIpAddr(ipAddr){
        this.ipAddr = ipAddr;
    }
}

module.exports = CasparCommon;