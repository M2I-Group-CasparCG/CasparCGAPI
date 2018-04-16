
const Caspar =            require('../../Caspar/Caspar.js');
const Channel =           require('../../Caspar/CasparChannel');
const ChannelMultiview =  require('../../Caspar/CasparChannelMultiview.js');

const Producer =          require('../../Caspar/Producers/CasparProducer.js');
const ProducerDdr =       require('../../Caspar/Producers/CasparProducerDdr.js');
const ProducerDecklink =  require('../../Caspar/Producers/CasparProducerDecklink.js');
const ProducerFile =      require('../../Caspar/Producers/CasparProducerFile.js');
const ProducerNet =       require('../../Caspar/Producers/CasparProducerNet.js');

const Consumer =          require('../../Caspar/Consumers/CasparConsumer.js');
const ConsumerScreen =    require('../../Caspar/Consumers/CasparConsumerScreen.js');
const ConsumerFile =      require('../../Caspar/Consumers/CasparConsumerFile.js');
const ConsumerNet =       require('../../Caspar/Consumers/CasparConsumerNet.js');

let count = 0;
let caspars = new Map();
let consumers = new Map();
let producers = new Map();
let channels = new Map();

module.exports = function(socket) {

    var caspar = {};

    /**
     * Message d'erreur envoyé quand 
     * @param {*} amcpMessage 
     */
    caspar.errorMessage = function(amcpMessage){
        let error = new Error();
            error.code = 500;
            error.type = 'AMCP protocol error';
            error.description = amcpMessage;
        return error;
    },

    /**
     * Create a new caspar object. Try to connect. 
     * @param {*} req 
     * @param {*} res 
     */
    caspar.connect = function(req, res){
        let casparSettings = req.body;

        let caspar = new Caspar(casparSettings);
            caspars.set(caspar.getId(),caspar);
            caspar.getInfo()
                .then(function(){
                    res.json(caspar);
                })
                .catch(error => {
                    console.log('error');
                    console.log(error);
                    res.json(error);
                });
          
    },

    /**
     * 
     * Get all caspar objects
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    caspar.getAll = function(req, res, next){
        console.log('getAll');
        let array = [...caspars];
        res.json(array);
    },

    /**
     * Check the validity of a casparObject. 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    caspar.check = function(req, res, next){
        console.log('check');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        if(caspar instanceof Caspar){
            next();
        }else{
            res.sendStatus('404');
        }
    },
    /**
     * Get a caspar by ID
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    caspar.get = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        if(caspar instanceof Caspar){
            res.json(caspars.get(casparId));
        }else{
            res.sendStatus(404);
        }
       
    },

    /**
     * Initialize a caspar object. Mutliview INI, PGM and PVW ini. To do before any other manipulation of the object. 
     * @param {} req 
     * @param {*} res 
     * @param {*} next 
     */
    caspar.ini = function(req, res, next) {
        console.log('ini');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            if (caspar.getCasparCommon().getChannelsNb() >= 3){
                caspar.ini();
                let array =  [...caspar.getChannels()];
                res.json(array);
            }
            else{
                var result = new Error();
                    result.status = 403;
                    result.message = "3 channels are required for initialization";
                res.json(result);
            }
        let crtChannels = caspar.getChannels();
        crtChannels.forEach(function (item, key, mapObj) {  
            if(socket){
                // console.log(mapObj);
                socket.emit('channelAdded',JSON.stringify(item));
                // socket.broadcast('channelAdded',JSON.stringify(mapObj));
            }  
        });  
           
        
    },
    
    caspar.delete = function(req, res){
        const casparId = parseInt(req.params.casparId);
        caspars.delete(casparId);
        res.sendStatus('202');
    }
    /**
     * Consumers
     * 
     */
    caspar.consumerGetAll = function(req,res,next){
        console.log('consumerGetAll');
        const casparId = parseInt(req.params.casparId);
        let caspar = caspars.get(parseInt(casparId));
        let array =  [...caspar.getConsumers()];
        res.json(array);
    },

    caspar.consumerAdd = function(req,res,next){
        console.log('addConsumer');
        let consumerSettings = req.body;
        let consumer = new ConsumerScreen(consumerSettings);
        consumers.set(consumer.getId(), consumer);
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            caspar.addConsumer(consumer);
        res.json(consumer);
    },

    caspar.consumerCheck = function(req,res,next){
        console.log('check');
        const consumerId = req.params.consumerId;
        let consumer = caspars.get(parseInt(casparId)).getCasparCommon().getConsumer(parseInt(consumerId));
        if(consumer instanceof Consumer){
            next();
        }else{
            res.sendStatus('404');
        }
    },

    caspar.consumerStart = function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);

        let consumer = caspars.get(casparId).getConsumer(consumerId);
            if (consumer instanceof Consumer){
                if (caspars.get(casparId).getChannel(consumer.getChannelId()) instanceof Channel){
                    consumer.run();
                    res.json(consumer);
                }else{
                    let error = new Error();
                        error.code = 404;
                        error.message = "consumer not assigned to an existing channel";
                        res.send(error);
                }        
            }else{
                let error = new Error();
                    error.code = 404;
                    error.message = "consumer not assigned to an existing channel";
                    res.send(error);
            }
           
    },

    caspar.consumerStop = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        
        let consumer = caspars.get(casparId).getConsumer(consumerId);
            consumer.stop();

            res.sendStatus(202);

    },
    caspar.consumerDelete = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        caspars.get(casparId).getConsumer(consumerId).stop();
        caspars.get(casparId).removeConsumer(consumerId);
        consumers.delete(casparId);
        res.sendStatus('202');

    },
    /**
     * Producers
     * 
     */
    caspar.producerGetAll = function(req, res){
        console.log('producerGetAll');
        const casparId = parseInt(req.params.casparId);
        let caspar = caspars.get(parseInt(casparId));
        let array =  [...caspar.getProducers()];
        res.json(array);
    },
    
    caspar.producerAdd = function(req, res){
        console.log('producerAdd');
        let producerType = req.params.type;
        let consumerSettings = req.body;
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        let producer = null;

        switch (producerType){
            case 'file' : {
                producer = new ProducerFile(consumerSettings);
            }break;
            case 'stream' : {
                producer = new ProducerStream(consumerSettings);
            }break;
            case 'ddr' : {
                producer = new ProducerDdr(consumerSettings);
            }break;
            case 'decklink' : {
                producer = new ProducerDecklink(consumerSettings);
            }break;
            case 'net' : {
                producer = new ProducerNet(consumerSettings);
            }break;
        }   

        if (producer instanceof Producer){
            producers.set(producer.getId(), producer)
            caspar.addProducer(producer);
            res.json(producer);
            if (socket) {
                socket.emit('producerAdded',JSON.stringify(producer));
                // socket.broadcast('producerAdded',JSON.stringify(producer));
            }
        }else{
            let error = new Map();
                error['errorType'] = "unknown producer type";
            res.json(error);
        }
    },
    caspar. producerCheck = function(req,res,next){
        console.log('check');
        const producerId = req.params.producerId;
        let producer = caspars.get(parseInt(casparId)).getCasparCommon().getProducer(parseInt(producerId));
        if(producer instanceof Producer){
            next();
        }else{
            res.sendStatus('404');
        }
    },
    caspar.producerStart = function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);

        let producer = caspars.get(casparId).getProducer(producerId);
            producer.run()
                .then(
                    function(msg){
                        res.sendStatus(202);
                    },
                    function(msg){
                        res.json(caspar.errorMessage(msg));
                    }
                ).catch(function(error){
                    console.log(error);
                });           
    },
    
    caspar.producerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);

        let producer = caspars.get(casparId).getProducer(producerId);
            producer.stop().then(
                function(msg){
                    res.sendStatus(202);
                },
                function(msg){
                    res.json(caspar.errorMessage(msg));
                }
            ).catch(function(error){
                console.log(error);
            });

    },
    caspar.producerDelete = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        caspars.get(casparId).getProducer(producerId).stop()
            .then(
                function(msg){
                    caspars.get(casparId).removeProducer(producerId);
                    producers.delete(producerId);
                    res.send('deleted');
                    if(socket){
                        socket.emit('producerRemoved',JSON.stringify(producerId));
                        // socket.broadcast('producerRemoved',JSON.stringify(producerId));
                    }
                },
                function(msg){
                    res.json(caspar.errorMessage(msg));
                }).catch(function(error){
                    console.log(error);
                });
    },

     /**
     * Channels
     * 
     */
    caspar.channelGetAll = function(req, res){
        console.log('consumerGetAll');
        const casparId = parseInt(req.params.casparId);
        let caspar = caspars.get(parseInt(casparId));
        let array =  [...caspar.getChannels()];
        res.json(array);
    },

    caspar.channelCheck = function(req,res,next){
        const channelId = parseInt(req.params.channelId);
        console.log('channelCheck');
        next();
    },
    caspar.channelGetAudioLevels = function(req,res,next){
        console.log('channelGetAudioLevels');
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const audioLevels = caspars.get(casparId).getChannel(channelId).getAudioLevels();
        let array =  [...audioLevels];
        res.json(array);
    
    },
    caspar.channelSwitch = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const producerId = parseInt(req.params.producerId);
        if (producers.get(producerId) instanceof Producer){
            caspars.get(casparId).getChannel(channelId).switchLayer(producerId);
            res.sendStatus('202');
            if(socket){
                socket.emit('inputSwitched',JSON.stringify({"channelId" : channelId, "inputId" : producerId}));
                // socket.broadcast('producerRemoved',JSON.stringify(producerId));
            }
    
        }else{
            let error = new Error();
            error.code = 404;
            error.message = 'producer not found';
            res.send(error);
        }
       
        
    }
    
    caspar.setXmlValues = function(req, res){
        const casparId = parseInt(req.params.casparId);
        caspars.get(casparId).setXmlValues(req.body);
        res.sendStatus('202');
    };


    caspar.oscParser = function (buffer, rinfo){

        /*
            OSC BUNDLE STRING : 
                8 bytes : OSC String #bundle
                8 bytes : OSC-timetag
                4 bytes : size of first element
                x bytes : first element
                4 bytes : size of next element
                x bytes : next element
    
                element :
                xx bytes    separator   value Type (1 byte)    value
                valueName   ,           x                      xxxxx
         
         */
    
        var result = new Map();                                                            // dictionnaire contenant les données récoltées.
        var bufferLength = buffer.length;                                           //longeur totale du buffer
        var cursor = 16;                                                            // on place le curseur à la taille de premier élément
        while(cursor < bufferLength){                                               // tant qu'il reste des données dans le buffer
            var elementSize = buffer.readInt32BE(cursor);                           // on récupère la longueur de l'élément
            var cursor = cursor + 4;                                                // on place le curseur au début de l'élément
            var element = buffer.slice(cursor, cursor+elementSize);                 // on récupère l'élément en entier
            // traitement de l'élément
            var valName = element.toString('utf-8').split(',')[0];
            var valNameLength = valName.length;
                valName = valName.replace(/\0/g,'');
            var valType = element.slice(valNameLength+1, valNameLength+2).toString();
            var valData = element.slice(valNameLength+2);
    
            switch(valType){                                                        // formattage des valeurs en fonction des types
                case 'i' :      // int32
                    valData = valData.readInt32BE(2);
                break;
                case 'f' :      // float32
                    valData = valData.readFloatBE(2);
                break;
                case 's' :      // string
                    valData = valData.toString('utf-8').replace(/\0/g,'');
                break;
                case 'b' :      // OSC-blob
                break;
                case 'h' :{      // 64bits BE float);
                    if(valData.length == 18){
                        valData = valData.readInt32BE(2+4) + '|' + valData.readInt32BE(6+8);
                    }else{
                        valData = valData.readInt32BE(2+4);
                    }
                }
                break;
                case 'T' :      // True
                    valData = true;
                break;
                case 'F' : {     // False
                    valData = false;
                }
                break;
            }
            result.set(valName,valData);
            // debug(valName+' : '+valData);
            cursor = cursor + elementSize;                                          // incrémentation du curseur 
        }
        this.oscRouter(result, rinfo['address']);
        return result;
    }

    caspar.oscRouter = function (msg, sourceIpAddr){
        // console.log(msg);
        // console.log(sourceIpAddr);
        caspars.forEach(function(caspar, casparId, map){
            const ipAddr = caspar.getCasparCommon().getIpAddr();
            if (ipAddr == sourceIpAddr){
                let result = caspar.oscAnalyzer(msg);
                if (result){                                            // envoi de socketIO
                    socket.emit('state',JSON.stringify(result));
                }
            }
        });
    }

    return caspar;
}