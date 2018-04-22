
const Caspar =            require('../../Caspar/Caspar.js');
const Channel =           require('../../Caspar/CasparChannel');
const ChannelMultiview =  require('../../Caspar/CasparChannelMultiview.js');
const Layer =             require('../../Caspar/CasparLayer.js')

const Producer =          require('../../Caspar/Producers/CasparProducer.js');
const ProducerDdr =       require('../../Caspar/Producers/CasparProducerDdr.js');
const ProducerDecklink =  require('../../Caspar/Producers/CasparProducerDecklink.js');
const ProducerFile =      require('../../Caspar/Producers/CasparProducerFile.js');
const ProducerNet =       require('../../Caspar/Producers/CasparProducerNet.js');

const Consumer =          require('../../Caspar/Consumers/CasparConsumer.js');
const ConsumerScreen =    require('../../Caspar/Consumers/CasparConsumerScreen.js');
const ConsumerFile =      require('../../Caspar/Consumers/CasparConsumerFile.js');
const ConsumerNet =       require('../../Caspar/Consumers/CasparConsumerNet.js');
const ConsumerDecklink =  require('../../Caspar/Consumers/CasparConsumerDecklink.js');

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
    caspar.add = function(req, res){
        let casparSettings = req.body;
        let caspar = new Caspar(casparSettings);
            caspars.set(caspar.getId(),caspar);
            caspar.getInfo()
                .then(function(){
                    res.json(caspar);
                })
                .catch(error => {
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

    caspar.edit = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        let casparSettings = req.body;
            console.log(casparSettings);
        let caspar = caspars.get(parseInt(casparId));
            res.send(caspar.edit(casparSettings))
    },

    caspar.editObject = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const objectId = parseInt(req.params.objectId);
        const objectType = req.params.objectType;
        const settings = req.body;
        let object = null;

        switch (objectType){
            case 'consumers' :{
                let consumer = caspar.getConsumer(objectId);
                if (consumer instanceof Consumer ){
                    object = consumer;
                }
            }break;
            case 'producers' :{
                console.log('producer');
                let producer = caspar.getProducer(objectId);
                if (producer instanceof Producer ){
                    object = producer;
                }
            }break;
            case 'channels' :{
                let channel = caspar.getChannel(objectId);
                if (channel instanceof Channel ){
                    object = channel;
                }
            }break;
            case 'layers' :{
                let layer = caspar.getLayer(objectId);
                if (layer instanceof Layer ){
                    object = layer;
                }
            }break;
        }

        if (object){
            let result = caspar.editObject(settings, object);
            res.send(result);
        }else{
            res.sendStatus(404);
        }
    },

    caspar.getObject = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const objectId = parseInt(req.params.objectId);
        const objectType = req.params.objectType;
        let object = null;
        console.log(objectType);
        switch (objectType){
            case 'consumers' :{
                let consumer = caspar.getConsumer(objectId);
                if (consumer instanceof Consumer ){
                    object = consumer;
                }
            }break;
            case 'producers' :{
                console.log('producer');
                let producer = caspar.getProducer(objectId);
                if (producer instanceof Producer ){
                    object = producer;
                }
            }break;
            case 'channels' :{
                let channel = caspar.getChannel(objectId);
                if (channel instanceof Channel ){
                    object = channel;
                }
            }break;
            case 'layers' :{
                let layer = caspar.getLayer(objectId);
                if (layer instanceof Layer ){
                    object = layer;
                }
            }break;
        }

        if (object){
            res.json(object);
        }else{
            res.sendStatus(404);
        }
    },
    
    caspar.getAllObjects = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const objectType = req.params.objectType;
        switch (objectType){
            case 'consumers' :{
                res.json([...caspar.getConsumers()]);
            }break;
            case 'producers' :{
                res.json([...caspar.getProducers()]);
            }break;
            case 'channels' :{
                res.json([...caspar.getChannels()]);
            }break;
            case 'layers' :{
                res.json([...caspar.getLayers()]);
            }break;
            default : {
                res.sendStatus(404);
            }
        }
    },
    caspar.restart = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        caspar.restart()
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

    caspar.delete = function(req, res){
        const casparId = parseInt(req.params.casparId);
        caspars.delete(casparId);
        res.sendStatus('202');
    }

    /**
     * Consumers
     * 
     */

    caspar.consumerAdd = function(req,res,next){
        console.log('addConsumer');
        const casparId = req.params.casparId;
        const consumerType = req.params.consumerType;
        let consumerSettings = req.body;
        let consumer = null;

        console.log(consumerType);

        switch(consumerType){
            case 'screen' : {
                consumer = new ConsumerScreen(consumerSettings);
            }
            break;
            case 'decklink' : {
                consumer = new ConsumerDecklink(consumerSettings);
            }
            break;
        }
        console.log(consumer);
        consumers.set(consumer.getId(), consumer);
       
        let caspar = caspars.get(parseInt(casparId));
            caspar.addConsumer(consumer);
        res.json(consumer);
    },

    caspar.consumerCheck = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        let consumer = caspars.get(casparId).getConsumer(consumerId);
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
            
                if (caspars.get(casparId).getChannel(consumer.getChannelId()) instanceof Channel){
                    consumer.run()
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

    caspar.producerCheck = function(req,res,next){
        console.log('producerCheck');
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);
        if(producer instanceof Producer){
            next();
            console.log('producerCheck ok')
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
        const producer = caspars.get(casparId).getProducer(producerId);
        if (producer instanceof Producer){
            producer.stop()
                .then(
                    function(msg){
                        caspars.get(casparId).removeProducer(producerId);
                        producers.delete(producerId);
                        res.json(producer);
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
        }else{
            let error = new Error();
            error.code = 404;
            error.message = 'producer not found';
            res.send(error);
        }
    },

     /**
     * Channels
     * 
     */
    caspar.channelCheck = function(req,res,next){
        console.log('channelCheck');
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        let channel = caspars.get(casparId).getProducer(channelId);
        if(channel instanceof Channel){
            next();
            console.log('channelCheck ok')
        }else{
            res.sendStatus('404');
        }
    },
    caspar.channelGetAudioLevels = function(req,res,next){
        console.log('channelGetAudioLevels');
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const audioLevels = caspars.get(casparId).getChannel(channelId).getAudioLevels();
        let array =  [...audioLevels];
        res.json(array);
    
    },
    caspar.channelSetInput = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const producerId = parseInt(req.params.producerId);
        const channel = caspars.get(casparId).getChannel(channelId);

        if (caspars.get(casparId).getProducer(producerId) instanceof Producer){
            channel.setInput(producerId)
                .then(
                    function(msg){
                        res.sendStatus(202);
                    },
                    function(msg){
                        res.json(caspar.errorMessage(msg));
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            let error = new Error();
            error.code = 404;
            error.message = 'producer not found';
            res.send(error);
        }
        
    
    },


    /**
     * 
     * LAYERS
     * 
     */


    caspar.layerAdd = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const settings = req.body; 
        res.json(caspar.addLayer(settings));
    },

    caspar.layerCheck = function (req, res, next){
        console.log('layerCheck');
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        if(layer instanceof Layer){
            next();
            console.log('layerCheck ok')
        }else{
            res.sendStatus('404');
        }
    },  

    caspar.layerDelete = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let result = caspars.get(casparId).removeLayer(layerId)
        res.json(result);

    },

    caspar.layerSetInput = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        const producerId = parseInt(req.params.producerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        if (caspars.get(casparId).getProducer(producerId) instanceof Producer){
            layer.setInput(producerId)
                .then(
                    function(msg){
                        res.sendStatus(202);
                    },
                    function(msg){
                        res.json(caspar.errorMessage(msg));
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            let error = new Error();
            error.code = 404;
            error.message = 'producer not found';
            res.send(error);
        }
    },

    caspar.layerStart = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        layer.start()
            .then(
                function(msg){
                    res.sendStatus(202);
                },
                function(msg){
                    res.json(caspar.errorMessage(msg));
                }).catch(function(error){
                    console.log(error);
                });
    },

    caspar.layerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        layer.stop()
            .then(
                function(msg){
                    res.sendStatus(202);
                },
                function(msg){
                    res.json(caspar.errorMessage(msg));
                }).catch(function(error){
                    console.log(error);
                });
    },
    
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