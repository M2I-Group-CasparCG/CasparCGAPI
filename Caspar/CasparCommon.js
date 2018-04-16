var net =               require('net');
var appRoot =           require('app-root-path');
var XMLHelper =         require(appRoot + '/XMLHandler/bin/xmlhelper.js');
var dgram =             require('dgram');


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
        this.id = settings['id'] || new Int();
        this.ipAddr = settings['ipAddr'] || '127.0.0.1';
        this.amcpPort = settings['amcpPort'] || 5250;
        this.oscDefaultPort = settings['oscDefaultPort'] || 6250;
        this.oscPredefinedClient = settings['oscPredefinedClient'] || new Array();
        this.logLevel = settings['logLevel'] || null;
        this.mediaPath = settings['mediaPath'] || null;
        this.logPath = settings['logPath'] || null;
        this.templatePath = settings['templatePath'] || null;
        this.thumbnailsPath = settings['thumbnailsPaths'] || null;
        this.pgmId = null;
        this.pvwId = null;
        this.mvId = null;
        this.online = false;
        this.socket = settings['socket'] || null;
        this.XmlHandler = new XMLHelper(appRoot + '/utilities/API/caspar.config');
        this.casparVersion = null;
        this.channelsNb = 0;

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

    /**
     * Sends a tcp msg to CasparCG, parse the answer
     * if caspar's return code = 10x or 20x, resolves the promise
     * if caspar's return code = 40x or 40x, rejects the promise
     * return a map with the differents keys :
     *      'command'           original command sended to caspar
     *      'returnCode'        return code (integer)
     *      'retrunMessage'     message returned with the return code
     *      'dataLines'         number of lines of data
     *      'data'              data
     * @param {*} msg 
     */
    tcpPromise (msg){
        
        let client = new net.Socket();
            client.setTimeout(2000);

        let amcpPort = this.amcpPort;
        let ipAddr = this.ipAddr;


        return new Promise(function(resolve,reject){
            let result = new Map();
                result['command'] = msg;
            client.connect(amcpPort, ipAddr, function() {
                client.write(msg+'\r\n');
            }); 

            client.on('error', function(error){
                result['returnCode'] = 500;
                result['returnMessage'] = 'Error on tcp socket'
                reject(result);
            });

            client.on('timeout', function(error){
                result['returnCode'] = 101;
                result['retrunMessage'] = 'CasparCG server is unreachable';
                let data = new Array();
                    data.push(ipAddr);
                    data.push(amcpPort);
                result['data'] = data;
                result['dataLines'] = data.length; 
                this.online = false;
                reject(result);
            });

            client.on('data', function(data) {
                const dataArray = data.toString().split('\r\n');
                const returnMessage =  dataArray[0].substr(4);
                const returnCode = dataArray[0].substring(0,3);
                    result['returnCode'] = parseInt(returnCode);
                    result['retrunMessage'] = returnMessage;
                switch (returnCode.substring(0,2)){
                    // INFORMATION
                    case '10' : {
                        switch (returnCode){
                            case '100' : {       // information about an event
                                result['dataLines'] = 0;
                            }
                            break;
                            case '101' : {       // information about an event and one line of data returned
                                result['dataLines'] = 1;
                                result['data'] = dataArray[1];
                            }
                            break;
                        }
                        resolve(result);
                    }
                    break;
                    // SUCCESS
                    case '20' : {
                        switch (returnCode){
                            case '200' : {       // command executed and several lines of data returned
                                result['data'] = dataArray.slice(1);
                                // suppression des valeurs vides
                                while(result['data'].slice(-1)[0] == ''){   
                                    result['data'].pop();
                                }
                                result['dataLines'] = result['data'].length;
                     
                            }       
                            break;
                            case '201' : {       // command executed and one line of data returned
                                result['dataLines'] = 1;
                                result['data'] = dataArray[1];
                            }
                            break;
                            case '202' : {        // command executed
                                result['dataLines'] = 0;
                            }
                            break;
                        }
                        resolve(result);
                    }
                    break;
                    // CLIENT ERROR
                    case '40' : {
                        switch (returnCode){
                            case '400' : {       // command not understood and one line of data returned
                                result['dataLines'] = 1;
                                result['data'] = dataArray[1];
                            }
                            break;
                            case '401' : {      // Illegal video channel
                                result['dataLines'] = 0;
                            }       
                            break; 
                            case '402' : {       // Missing parameters
                                result['dataLines'] = 0;
                            }      
                            break;
                            case '403' : {       // Illegal parameter
                                result['dataLines'] = 0;
                            }      
                            break; 
                            case '404' : {      // Media file not found
                                result['dataLines'] = 0;
                            }       
                            break;
                        }
                        reject(result);
                    }
                    break;
                    // SERVER ERROR
                    case '50' : {
                        switch (returnCode){
                            case '500' : {      // FAILED
                                result['dataLines'] = 0;
                            }       
                            break;
                            case '501' : {      // FAILED - internal server error
                                result['dataLines'] = 0;
                            }      
                            break;
                            case '502' : {      // Failed - media unreachable
                                result['dataLines'] = 0;
                            }       
                            break;
                            case '503' : {      // failes - access error
                                result['dataLines'] = 0;
                            }       
                            break;
                        }
                        reject(result);
                    }
                    break;                
                }
                client.destroy();
            });

            client.on('close', function() {
                console.log('');
            });

        });

    }


    

    /**
     *  SETTERS / GETTERS
     */

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
    setCasparVersion(version){
        this.casparVersion = version;
    }
    setChannelsNb(channelsNb){
        this.channelsNb = channelsNb;
    }
    getChannelsNb(){
        return this.channelsNb;
    }
    getIpAddr(){
        return this.ipAddr;
    }
    getId(){
        return this.id;
    }
}

module.exports = CasparCommon;