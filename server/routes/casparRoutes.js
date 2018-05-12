// ++ todo
// add JSON validator
// add url variables type validator. 


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

const ApiReturn =         require('./ApiReturn.js');

let count = 0;
let caspars = new Map();
let consumers = new Map();
let producers = new Map();
let channels = new Map();

module.exports = function(socket) {

    var casparRoutes = {};                      
    var apiReturn = new ApiReturn();            // objet permettant de générer les messages API


    /** TEMP
     *  FOR TEST PURPOSES
     * Add a default caspar instance with screen
     */
    
    // let testCasparSettings = new Array();
    // testCasparSettings['ipAddr'] = '192.168.1.231';
    // testCasparSettings['amcpPort'] = '5250';
    // testCasparSettings['name'] = 'auto Test';
    // let testCaspar = new Caspar(testCasparSettings);
    // testCaspar.restart()
    //     .then(
    //         function(resolve){
    //             console.log('restart');
    //         },
    //         function(reject){
    //             console.log(reject);
    //         }
    //     )

    // setTimeout(
    //     function(){
    //         console.log('timeout');
    //         caspars.set(testCaspar.getId(),testCaspar);
    //         testCaspar.getInfo()
    //             .then(function(){
    //                console.log('default caspar added')
    //             })
    //             .catch(error => {
    //                 console.log(error);
                   
    //             });
    //         testCasparConsumer = new Array();
    //         testCasparConsumer['channelId'] = 1;
    //         testConsumer = new ConsumerScreen(testCasparConsumer)
    //         testCaspar.addConsumer(testConsumer);
    //         // testConsumer.run();
    //     },
    //     2000
    // );
   

    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * CASPAR instances manipulation
     */
    
    /**
     * Create a new caspar object. Try to connect. 
     */
    casparRoutes.add = async function(req, res){
        let casparSettings = req.body;
        console.log(casparSettings);
        let caspar = new Caspar(casparSettings);
            caspars.set(caspar.getId(),caspar);
            caspar.getInfo()
                .then(function(){
                    res.json(caspar);
                    socket.emit('casparAdd',JSON.stringify(caspar));
                })
                .catch(error => {
                    console.log(error);
                    res.json(apiReturn.customMessage(500, 'caspar error', 'error while retrieving server informations'));
                });
    },

    /**
     * 
     * Get all caspar objects
     */
    casparRoutes.getAll = function(req, res, next){
        console.log('getAll');
        let array = [...caspars];
        console.log(array);
        res.json(array);
    },

    /**
     * Check the validity of a casparObject. 
     */
    casparRoutes.check = function(req, res, next){
        console.log('check');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        if(caspar instanceof Caspar){
            next();
        }else{
            res.json(apiReturn.notFoundMessage('caspar instance not found'));
        }
    },

    /**
     * Get a caspar by ID 
     */
    casparRoutes.get = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        if(caspar instanceof Caspar){
            res.json(caspars.get(casparId));
        }else{
            res.json(apiReturn.notFoundMessage('caspar instance not found'));
        }
       
    },

    /**
     * Initialize a caspar object. Mutliview INI, PGM and PVW ini. To do before any other manipulation of the object. 
     * A revoir.
     */
    casparRoutes.ini = function(req, res, next) {
        console.log('ini');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            if (caspar.getCasparCommon().getChannelsNb() >= 3){
                caspar.ini();
                let array =  [...caspar.getChannels()];
                res.json(array);
            }
            else{
                res.json(apiReturn.customMessage(500, 'caspar error', 'Is caspar online ? Caspar must have at least 3 channels. Check your config.json file.'));
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

    /**
     * Edit caspar settings
     */
    casparRoutes.edit = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        let casparSettings = req.body;
        let casparCommon = caspars.get(parseInt(casparId)).getCasparCommon();
        let result = new Object();
            for (let setting in casparSettings){
                let response = casparCommon.edit(setting,casparSettings[setting]);
                result[setting] = response[setting];
            }
            res.json(apiReturn.successMessage(result));
    },

    /**
     * Restart the caspar server
     */
    casparRoutes.restart = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        caspar.restart()
            .then(
                 function(msg){
                        res.json(apiReturn.successMessage('successful restart'))
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage(msg));
                    }
            ).catch(function(error){
                console.log(error);
                });           
    },

    /**
     * Delete a caspar instance
     */
    casparRoutes.delete = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        if ( caspar instanceof Caspar){
            caspars.delete(casparId);
            res.json(apiReturn.successMessage('caspar instance deleted'));
            socket.emit('casparDelete',JSON.stringify(caspar));
        } else{
            res.json(apiReturn.notFoundMessage('Caspar instance not found'));
        }
        
    },

    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * CASPAR sub-objects manipulation
     */

    /**
     * Edit caspar sub-object (producer, consumer, channel, layer, etc.)
     */
    casparRoutes.editObject = function (req, res){
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

            let result = new Object();
            for (let setting in settings){
                console.log(setting+' '+settings[setting]);
                let response = object.edit(setting, settings[setting]);
                result[setting] = response[setting];
            }
            res.json(apiReturn.successMessage(result));
        }else{
            res.json(apiReturn.requestErrorMessage('unkown object type'));
        }
    },

    /**
     * Get a caspar sub-object (producer, consumer, channel, layer, etc.) by id.
     */
    casparRoutes.getObject = function (req, res){
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
            default : {
                res.json(apiReturn.notFoundMessage('objectType unknown'))
            }
        }

        if (object){
            res.json(object);
        }else{
            res.json(apiReturn.notFoundMessage(objectType +' instance not found'))
        }
    },
    
    /**
     * Get all the instances of a caspar sub-object (producer, consumer, channel, layer, etc.)
     */
    casparRoutes.getAllObjects = function (req, res){
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
                res.json(apiReturn.requestErrorMessage('unknown object type'));
            }
        }
    },


    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * CONSUMERS manipulation
     */

    /**
     * Create a consumer instance into an capsar instance
     */
    casparRoutes.consumerAdd = function(req,res,next){
        console.log('addConsumer');

        const casparId = parseInt(req.params.casparId);
        const consumerType = req.params.consumerType;
        let consumerSettings = req.body;
        let consumer = null;

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

        if (consumer instanceof Consumer){
            consumers.set(consumer.getId(), consumer);
            caspars.get(casparId).addConsumer(consumer);
            res.json(consumer);
            if(socket){
                socket.emit('consumerAdd', JSON.stringify(consumer));
                socket.broadcast('consumerAdd',JSON.stringify(consumer));
            }
        }else{
            res.json(apiReturn.requestErrorMessage('unknown consumer type : '+consumerType));
        }
        
    },

    /**
     * Check if the requested consumer instance exists.
     */
    casparRoutes.consumerCheck = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        let consumer = caspars.get(casparId).getConsumer(consumerId);
        if(consumer instanceof Consumer){
            next();
        }else{
            res.json(apiReturn.notFoundMessage('Consumer instance not found'));
        }
    },

    /**
     * Start the play a consumer instance
     */
    casparRoutes.consumerStart = function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);    


        let consumer = caspars.get(casparId).getConsumer(consumerId);
            
                if (caspars.get(casparId).getChannel(consumer.getChannelId()) instanceof Channel){
                    consumer.run()
                        .then(
                                function(msg){
                                res.json(apiReturn.successMessage('Consumer started'));
                            },
                            function(msg){
                                res.json(apiReturn.amcpErrorMessage(msg));
                            }
                        ).catch(function(error){
                          console.log(error);
                          });           
                }else{
                        res.json(apiReturn.notFoundMessage('consumers channel not found'))
                }        

           
    },

    /**
     * Stop the play of a consumer instance
     */
    casparRoutes.consumerStop = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        
        let consumer = caspars.get(casparId).getConsumer(consumerId);
            consumer.stop()
                .then(
                        function(msg){
                        res.json(apiReturn.successMessage('Consumer stoped'));
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage(msg));
                    }
                ).catch(function(error){
                    console.log(error);
                });      
    },

    /**
     * Stop and delete a consumer instance. 
     */
    casparRoutes.consumerDelete = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        const consumer = caspars.get(casparId).getConsumer(consumerId);

        if (consumer instanceof Consumer){
            consumer.stop()
            .then(
                function(msg){
                caspars.get(casparId).removeConsumer(consumerId);
                consumers.delete(casparId);
                res.json(apiReturn.successMessage('Consumer removed'));
                if(socket){
                    socket.emit('consumerDelete', JSON.stringify(consumer));
                    socket.broadcast('consumerDelete',JSON.stringify(consumer));
                }
            },
            function(msg){
                res.json(apiReturn.amcpErrorMessage(msg));
            }
            ).catch(function(error){
                console.log(error);
            });      
        }else{
            res.json(apiReturn.notFoundMessage('Consumer instance not found'));
        }

       
    },

    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * PRODUCERS manipulation
     */
    
    /**
     * Create a producer instance into an capsar instance
     */
    casparRoutes.producerAdd = function(req, res, next){
        console.log('producerAdd');
        let producerType = req.params.producerType;
        let consumerSettings = req.body;
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        let producer = null;

        switch (producerType){
            case 'file' : {
                producer = new ProducerFile(consumerSettings);
            }break;
            case 'net' : {
                producer = new ProducerNet(consumerSettings);
            }break;
            case 'ddr' : {
                producer = new ProducerDdr(consumerSettings);
            }break;
            case 'decklink' : {
                producer = new ProducerDecklink(consumerSettings);
            }break;
            default : {
                res.json(apiReturn.requestErrorMessage('unknown producer type'));
            }
        }   

        if (producer instanceof Producer){
            producers.set(producer.getId(), producer)
            caspar.addProducer(producer);
            res.json(producer);
            if (socket) {
                socket.emit('producerAdd',JSON.stringify(producer));
                socket.broadcast('producerAdded',JSON.stringify(producer));
            }
        }
    },

    /**
     * Check if the requested producer instance exists.
     */
    casparRoutes.producerCheck = function(req,res,next){
        console.log('producerCheck');
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);
        if(producer instanceof Producer){
            next();
            console.log('producerCheck ok')
        }else{
            res.json(apiReturn.notFoundMessage('Producer instance not found'));
        }
    },

    /**
     * Start playing a producer instance
     */
    casparRoutes.producerStart = function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);

            producer.run()
                .then(
                    function(msg){
                        res.json(apiReturn.successMessage('producer started'));
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage(msg));
                    }
                ).catch(function(error){
                    console.log(error);
                });           
    },
    
    /**
     * Stop playing a producer instance. 
     */
    casparRoutes.producerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);

        let producer = caspars.get(casparId).getProducer(producerId);
            producer.stop().then(
                function(msg){
                    res.json(apiReturn.successMessage('producer stoped'));
                },
                function(msg){
                    res.json(apiReturn.amcpErrorMessage(msg));
                }
            ).catch(function(error){
                console.log(error);
            });

    },

    /**
     * Delete a producer instance
     */
    casparRoutes.producerDelete = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        const producer = caspars.get(casparId).getProducer(producerId);
        if (producer instanceof Producer){
            producer.stop()
                .then(
                    function(msg){
                        caspars.get(casparId).removeProducer(producerId);
                        producers.delete(producerId);
                        res.json(apiReturn.successMessage('producer deleted'));
                        if(socket){
                            socket.emit('producerDelete', JSON.stringify(producer));
                            socket.broadcast('producerDelete',JSON.stringify(producer));
                        }
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage(msg));
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            res.json(apiReturn.notFoundMessage('producer instance not found'));
        }
    },

    
    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * CHANNELS manipulation
     */

    /**
     * Create a consumer instance into an capsar instance
     */
    casparRoutes.channelAdd = function (res, req, next){

    }

    /**
     * Check if the requested channel instance exists.
     */
    casparRoutes.channelCheck = function(req,res,next){
        console.log('channelCheck');
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        let channel = caspars.get(casparId).getChannel(channelId);
        if(channel instanceof Channel){
            next();
            console.log('channelCheck ok')
        }else{
            res.json(apiReturn.notFoundMessage('Channel instance not found'));
        }
    },

    /**
     * To be deleted (remplaced by osc send);
     * Return the audio levels of a channel
     */
    casparRoutes.channelGetAudioLevels = function(req,res,next){
        console.log('channelGetAudioLevels');
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const audioLevels = caspars.get(casparId).getChannel(channelId).getAudioLevels();
        let array =  [...audioLevels];
        res.json(array);
    
    },
    
    /**
     * Set a producer to a channel 
     */
    casparRoutes.channelSetInput = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const producerId = parseInt(req.params.producerId);
        const channel = caspars.get(casparId).getChannel(channelId);

        if (caspars.get(casparId).getProducer(producerId) instanceof Producer){
            channel.setInput(producerId)
                .then(
                    function(msg){  
                        res.json(apiReturn.successMessage('Channel\'s input switched'));
                    },
                    function(msg){
                        console.log(msg);
                        res.json(apiReturn.amcpErrorMessage());
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            console.log('Producer not found');
            res.json(apiReturn.notFoundMessage('Producer not found'));
        }
        
    
    },

    /**
     * Delete a channel instance
     */
    casparRoutes.channelDelete = function (res, req, next){

    }


    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * LAYERS manipulation
     */

    /**
     * Create a layer instance into an capsar instance
     */
    casparRoutes.layerAdd = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const settings = req.body; 

        let result = caspar.addLayer(settings);
        if (result){
            res.json(result);
        }else{
            res.json(apiReturn.notFoundMessage('Channel instance not found'));
        }
       
    },

    /**
     * Check if the requested layer instance exists.
     */
    casparRoutes.layerCheck = function (req, res, next){
        console.log('layerCheck');
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        if(layer instanceof Layer){
            next();
            console.log('layerCheck ok')
        }else{
            res.json(apiReturn.notFoundMessage('Layer instance not found'));
        }
    },  

    /**
     * Set a producer to a layer
     */
    casparRoutes.layerSetInput = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        const producerId = parseInt(req.params.producerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        if (caspars.get(casparId).getProducer(producerId) instanceof Producer){
            layer.setInput(producerId)
                .then(
                    function(msg){
                        res.json(apiReturn.successMessage('Layer\'s input switched'));
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage(msg));
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            res.json(apiReturn.notFoundMessage('producer not found'));
        }
    },

    /**
     * Start the playing of a layer
     */
    casparRoutes.layerStart = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        layer.start()
            .then(
                function(msg){
                    res.json(apiReturn.successMessage('Layer started'))
                },
                function(msg){
                    res.json(apiReturn.amcpErrorMessage(msg));
                }).catch(function(error){
                    console.log(error);
                });
    },

    /**
     * Stop the playing of a layer
     */
    casparRoutes.layerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        layer.stop()
            .then(
                function(msg){
                    res.json(apiReturn.successMessage('Layer stoped'))
                },
                function(msg){
                    res.json(apiReturn.amcpErrorMessage(msg));
                }).catch(function(error){
                    console.log(error);
                });
    },

        /**
     * Delete a layer instance
     */
    casparRoutes.layerDelete = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        const layer = caspars.get(casparId).getLayer(layerId);
        console.log(layer);
        if (layer instanceof Layer){
            let result = caspars.get(casparId).removeLayer(layerId);
            if (result){
                res.json(apiReturn.successMessage('Layer deleted'));
            }else{
                res.json(apiReturn.notFoundMessage('Unable to delete layer'));
            }
        }else{
            res.json(apiReturn.notFoundMessage('Layer instance not found'));
        }
       
       

    },
    
    /**
     * To be deleted ? Use on settings changes in caspar getters/setters
     */
    casparRoutes.setXmlValues = function(req, res){
        const casparId = parseInt(req.params.casparId);
        caspars.get(casparId).setXmlValues(req.body);
        res.sendStatus('202');
    };



    /**
     * _____________________________________________________________________________________________________________________________
     * 
     * API Utilities
     */

    casparRoutes.oscParser = function (buffer, rinfo){

       

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
            cursor = cursor + 4;                                                // on place le curseur au début de l'élément
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
            cursor = cursor + elementSize;                                          // incrémentation du curseur 
        }
        this.oscRouter(result, rinfo['address']);
        return result;
    }

    casparRoutes.oscRouter = function (msg, sourceIpAddr){
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

    return casparRoutes;
}