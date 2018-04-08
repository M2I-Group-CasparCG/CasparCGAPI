
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
     * Create a new caspar object. Try to connect. 
     * @param {*} req 
     * @param {*} res 
     */
    caspar.connect = function(req, res){
        let casparSettings = req.body;
        let caspar = new Caspar(casparSettings);
            caspars.set(caspar.getId(),caspar);
            caspar.getCasparCommon().tcpPromise('CLEAR 1-1000')
                .then(function(result){// test de connection au serveur caspar
                    // si la requête est un succès
                    if(result.indexOf('202') === 0){
                        caspar.getCasparCommon().setOnline(true);
                    }else if (result == 'timeout'){
                        caspar.getCasparCommon().setOnline(false);
                    }else{
                        caspar.getCasparCommon().setOnline(false);
                    }
                    res.json(caspar);
                    
                    if(socket){
                        socket.emit('message',JSON.stringify(caspar));
                        // socket.broadcast('message',JSON.stringify(caspar));
                    }
                })
                .catch(error => {
                    console.log(error);
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
            caspar.ini();
            res.sendStatus('202');
        
        let crtChannels = caspar.getChannels();
        crtChannels.forEach(function (item, key, mapObj) {  
            if(socket){
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
            producer.run();
            res.sendStatus('202'); 
    },
    
    caspar.producerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);

        let producer = caspars.get(casparId).getProducer(producerId);
            producer.stop();
            res.sendStatus('202'); 

    },
    caspar.producerDelete = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        caspars.get(casparId).getProducer(producerId).stop();
        caspars.get(casparId).removeProducer(producerId);
        producers.delete(producerId);
        res.sendStatus('202');
        if(socket){
            socket.emit('producerRemoved',JSON.stringify(producerId));
            // socket.broadcast('producerRemoved',JSON.stringify(producerId));
        }

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
        next();

    },
    caspar.channelSwitch = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const producerId = parseInt(req.params.producerId);
        console.log(producerId);
        console.log(producers.get(producerId));
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

    return caspar;
}

// module.exports = caspar;