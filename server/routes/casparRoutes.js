
/**
 * Depedencies
 */

const Caspar =            require('../../Caspar/Caspar.js');
const Channel =           require('../../Caspar/CasparChannel');
const ChannelMultiview =  require('../../Caspar/CasparChannelMultiview.js');
const Layer =             require('../../Caspar/CasparLayer.js')
const Media =             require('../../Caspar/Producers/CasparMedia.js')
const Playlist =          require('../../Caspar/Producers/CasparPlaylist.js');

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



let caspars = new Map();                        // map containing the caspar instances created


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
    // testCasparSettings['socketIo'] = socket;
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

    //         setTimeout(
    //             function(){
    //                 testCasparConsumer = new Array();
    //                 testCasparConsumer['channelId'] = 1;
    //                 testCasparConsumer['name'] = 'Consumer1';
    //                 // testCasparConsumer['fullscreen'] = true;
    //                 let testConsumer = new ConsumerScreen(testCasparConsumer)
    //                 testCaspar.addConsumer(testConsumer);
    //                 // testConsumer.run();

    //                 testFileSettings = new Array();
    //                 testFileSettings['name'] = 'AMB';
    //                 testFileSettings['fileName'] = 'amb';
    //                 testFileSettings['playMode'] = 'loop';
    //                 let testFile = new ProducerFile(testFileSettings);
    //                 testCaspar.addProducer(testFile);

    //                 testFileSettings2 = new Array();
    //                 testFileSettings2['name'] = 'GO';
    //                 testFileSettings2['fileName'] = 'GO1080P25';
    //                 testFileSettings2['playMode'] = 'loop';
    //                 let testFile2 = new ProducerFile(testFileSettings2);
    //                 testCaspar.addProducer(testFile2);

    //                 testFileSettings3 = new Array();
    //                 testFileSettings3['name'] = 'itescia';
    //                 testFileSettings3['fileName'] = 'itescia';
    //                 testFileSettings3['playMode'] = 'loop';
    //                 let testFile3 = new ProducerFile(testFileSettings3);
    //                 testCaspar.addProducer(testFile3);

    //                 playlistSettings = new Array();
    //                 playlistSettings['name'] = 'autoPlaylist';
    //                 let playlist = testCaspar.addPlaylist(playlistSettings)
    //                     playlist.addMedia(3);    
    //                     playlist.addMedia(74);
    //                     playlist.addMedia(73);
    //                     playlist.addMedia(4);
                    
    //                 ddrSettings = new Array();
    //                 ddrSettings['name']  = 'autoDDR';
    //                 ddrSettings['playlist']  = playlist;
    //                 let ddr = new ProducerDdr(ddrSettings);
    //                 testCaspar.addProducer(ddr);


    //             },2000);
    //     },
    //     4000
    // );
    

    /**playlistCopy
     * Remove socketIO
     */
   cleanObject  = function(object){
    const objectCopy = Object.assign({}, object);
    if (objectCopy.casparCommon){
        const casparCommonCopy = Object.assign({}, objectCopy.casparCommon);
        delete casparCommonCopy.socketIo;
        objectCopy.casparCommon = casparCommonCopy;
        
        const playlistCopy =  Object.assign({}, objectCopy.playlist);
        if (playlistCopy){
            playlistCopy.casparCommon = casparCommonCopy;
            objectCopy.playlist = playlistCopy;
        }
    }
    if (objectCopy.pausedTimeout){
        delete objectCopy.pausedTimeout;
    }

        return objectCopy;
    }

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
            casparSettings.socketIo = socket;
        let caspar = new Caspar(casparSettings);
            caspars.set(caspar.getId(),caspar);
            res.json(caspar.clean());
            socket.emit('casparAdd', caspar.clean());
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         res.json(apiReturn.customMessage(500, 'caspar error', 'error while retrieving server informations'));
            //     });
    },

    /**
     * Return all caspar instances
     */
    casparRoutes.getAll = function(req, res, next){
        console.log('getAll');
        
        let array = [...caspars];
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        res.json(array);
    },

    /**
     * Check the validity of a caspar id.
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
            res.json(cleanObject(caspars.get(casparId)));
        }else{
            res.json(apiReturn.notFoundMessage('caspar instance not found'));
        }

    },

    /**
     * Initialize a caspar object. Mutliview INI, PGM and PVW ini. To do before any other manipulation of the object.
     * A revoir.
     */
    casparRoutes.ini = function(req, res, next) {
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            if (caspar.getCasparCommon().getChannelsNb() >= 3){
                caspar.ini();
                let array =  [...caspar.getChannels()];
                for(let n in array){
                    array[n][1] = cleanObject(array[n][1]);
                }
                res.json(array);
            }
            else{
                res.json(apiReturn.customMessage(500, 'caspar error', 'Is caspar online ? Caspar must have at least 3 channels. Check your config.json file.'));
            }
        let crtChannels = caspar.getChannels();
        crtChannels.forEach(function (item, key, mapObj) {
            if(socket){
                socket.emit('channelAdd',JSON.stringify(cleanObject(item)));
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
            socket.emit('casparDelete',caspar.clean());
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
            case 'playlists' :{
                let playlist = caspar.getPlaylist(objectId);
                if (playlist instanceof Playlist ){
                    object = playlist;
                }
            }break;
        }
        if (object){
            const response = object.edit(settings);
            res.json(apiReturn.successMessage(response));
            socket.emit(objectType.slice(0, -1)+'Edit', object.clean());
        }else{
            res.json(apiReturn.errorMessage('unkown object type'));
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
        switch (objectType){
            case 'consumers' :{
                let consumer = caspar.getConsumer(objectId);
                if (consumer instanceof Consumer ){
                    object = consumer;
                }
            }break;
            case 'producers' :{
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
            case 'medias' :{
                let media = caspar.getMedia(objectId);
                if (media instanceof Media ){
                    object = media;
                }
            }break;
            case 'playlists' :{
                let playlist = caspar.getPlaylist(objectId);
                if (playlist instanceof Playlist ){
                    object = playlist;
                }
            }break;
            default : {
                res.json(apiReturn.notFoundMessage('objectType unknown'))
            }
        }

        if (object){
            res.json(cleanObject(object));
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
        let array = [];
        switch (objectType){
            case 'consumers' :{
                array = [...caspar.getConsumers()];
            }break;
            case 'producers' :{
                array = [...caspar.getProducers()];
            }break;
            case 'channels' :{
                array = [...caspar.getChannels()];
            }break;
            case 'layers' :{
                array = [...caspar.getLayers()];
            }break;
            case 'medias' :{
              array = [...caspar.getMedias()];
            }break;
            case 'playlists' :{
               array = [...caspar.getPlaylists()];
            }break;
            default : {
                res.json(apiReturn.requestErrorMessage('unknown object type'));
            }
        }
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        // console.log(array);
        res.json(array);

    },


    /**
     * _____________________________________________________________________________________________________________________________
     *
     * CONSUMERS manipulation
     */

    /**
     * Create a consumer instance into an capsar instance
     */
    casparRoutes.consumerAdd = function(req,res,next){;
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
            case 'stream' : {
                consumer = new ConsumerNet(consumerSettings);
            }
            break;
            case 'file' : {
                consumer = new ConsumerFile(consumerSettings);
            }
            break;
        }

        if (consumer instanceof Consumer){
            caspars.get(casparId).addConsumer(consumer);
            res.json(consumer.clean());
            socket.emit('consumerAdd',consumer.clean());
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
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);


        let consumer = caspars.get(casparId).getConsumer(consumerId);
            if (caspars.get(casparId).getChannel(consumer.getChannelId()) instanceof Channel){
               consumer.run();
                res.json(apiReturn.successMessage('Command summited !'));
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
        consumer.stop();
        res.json(apiReturn.successMessage('Command summited !'));

    },

    /**
     * Stop and delete a consumer instance.
     */
    casparRoutes.consumerDelete = function(req, res, next){
        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);
        const consumer = caspars.get(casparId).getConsumer(consumerId);

        if (consumer instanceof Consumer){
            caspars.get(casparId).removeConsumer(consumerId);
            res.json(apiReturn.successMessage('Consumer removed'));
            socket.emit('consumerDelete', consumer.clean());
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
        let producerType = req.params.producerType;
        let producerSettings = req.body;
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        let producer = null;
        switch (producerType){
            case 'file' : {
                producer = new ProducerFile(producerSettings);
            }break;
            case 'stream' : {
                producer = new ProducerNet(producerSettings);
            }break;
            case 'decklink' : {
                producer = new ProducerDecklink(producerSettings);
            }break;
            case 'ddr' : {
                producer = new ProducerDdr(producerSettings);
            }break;
            default : {
                res.json(apiReturn.requestErrorMessage('unknown producer type'));
            }
        }
        if (producer instanceof Producer){
            caspar.addProducer(producer);
            res.json(cleanObject(producer));
            if (socket) {
                socket.emit('producerAdd',producer.clean());
            }
        }
    },

    /**
     * Check if the requested producer instance exists.
     */
    casparRoutes.producerCheck = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);
        if(producer instanceof Producer){
            next();
        }else{
            res.json(apiReturn.notFoundMessage('Producer instance not found'));
        }
    },

    /**
     * Start playing a producer instance
     */
    casparRoutes.producerStart = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);
            producer.run();
            res.json(apiReturn.successMessage('producer start command sended'));
    },

    /**
     * Stop playing a producer instance.
     */
    casparRoutes.producerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        let producer = caspars.get(casparId).getProducer(producerId);
            producer.stop();
            res.json(apiReturn.successMessage('producer stop command sended'));

    },

    /**
     * Delete a producer instance
     */
    casparRoutes.producerDelete = function(req,res){
        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);
        const producer = caspars.get(casparId).getProducer(producerId);
        if (producer instanceof Producer){
            caspars.get(casparId).removeProducer(producerId);
            res.json(apiReturn.successMessage('producer deleted'));
            if(socket){
                socket.emit('producerDelete', producer.clean());
            }
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
     * To be implemented
     */
    casparRoutes.channelAdd = function (res, req, next){

    }

    /**
     * Check if the requested channel instance exists.
     */
    casparRoutes.channelCheck = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        let channel = caspars.get(casparId).getChannel(channelId);
        if(channel instanceof Channel){
            next();
        }else{
            res.json(apiReturn.notFoundMessage('Channel instance not found'));
        }
    },

    /**
     * To be deleted (remplaced by osc send);
     * Return the audio levels of a channel
     */
    casparRoutes.channelGetAudioLevels = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const audioLevels = caspars.get(casparId).getChannel(channelId).getAudioLevels();
        let array =  [...audioLevels];
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
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
                        socket.emit('channelEdit', cleanObject(channel));
                    },
                    function(msg){
                        res.json(apiReturn.amcpErrorMessage());
                    }).catch(function(error){
                        console.log(error);
                    });
        }else{
            res.json(apiReturn.notFoundMessage('Producer not found'));
        }
    },

    /**
     * Get all the layers of a channel
     */
    casparRoutes.channelLayersGetAll = function (req,res) {
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const channel = caspars.get(casparId).getChannel(channelId);

        let array = [...channel.getLayers()];
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        res.json(array);

    },

    /**
     * Delete a channel instance
     * To be implemented
     */
    casparRoutes.channelDelete = function (res, req, next){

    },


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

        let layer = caspar.addLayer(settings);
        if (layer){
            res.json(cleanObject(layer));
            socket.emit('layerAdd',layer.clean());
        }else{
            res.json(apiReturn.notFoundMessage('Channel instance not found'));
        }

    },

    /**
     * Check if the requested layer instance exists.
     */
    casparRoutes.layerCheck = function (req, res, next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        if(layer instanceof Layer){
            next();
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
            layer.setInput(producerId);
            res.json(apiReturn.successMessage('Layer Input Switched'));
            socket.emit('layerEdit', layer.clean());
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
        layer.start();
        res.json(apiReturn.successMessage('Layer start command sended'));
    },

    /**
     * Stop the playing of a layer
     */
    casparRoutes.layerStop = function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        let layer = caspars.get(casparId).getLayer(layerId);
        layer.stop();
        res.json(apiReturn.successMessage('Layer start command sended'));
    },

    /**
     * Delete a layer instance
     */
    casparRoutes.layerDelete = function (req, res){
        const casparId = parseInt(req.params.casparId);
        const layerId = parseInt(req.params.layerId);
        const layer = caspars.get(casparId).getLayer(layerId);
        if (layer instanceof Layer){
            let result = caspars.get(casparId).removeLayer(layerId);
            if (result){
                res.json(apiReturn.successMessage('Layer deleted'));
                socket.emit('layerDelete', layer.clean());
            }else{
                res.json(apiReturn.notFoundMessage('Unable to delete layer'));
            }
        }else{
            res.json(apiReturn.notFoundMessage('Layer instance not found'));
        }
    },

    /**
    * _____________________________________________________________________________________________________________________________
    *
    * DDR manipulation
    */

    /**
     * Check if the ddr id is valid
     */
    casparRoutes.ddrCheck = function(req,res,next) {
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        if(ddr instanceof ProducerDdr){
            next();
            console.log('ddrCheck ok')
        }else{
            res.json(apiReturn.notFoundMessage('DDR instance not found'));
        }
    },

    /**
     * Launch the play function of the DDR
     *
     */
    casparRoutes.ddrPlay = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.resume()
        res.json(apiReturn.successMessage('Ddr play command sended'));

    },

    /**
     *  Launch the play function of the DDR on a specific media id
     */
    casparRoutes.ddrPlayId = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        const index = parseInt(req.params.index);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.playId(index);
        res.json(apiReturn.successMessage('Ddr playId command sended'));

    },

    /**
     *  Launch the play function of the DDR on a specific media time
     */
    casparRoutes.ddrSeek = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        const frame = parseInt(req.params.frame);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.seek(frame);
        res.json(apiReturn.successMessage('Ddr seek command sended'));
    },

    /**
     *  Launch the pause function of the DDR
     */
    casparRoutes.ddrPause = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.pause();
        res.json(apiReturn.successMessage('Ddr pause command sended'));

    }

    /**
     *  Play the next media on the DDR
     */
    casparRoutes.ddrNext = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);

        ddr.next()
        res.json(apiReturn.successMessage('Ddr next command sended'));
    },

    /**
     *  Play the previous media on the DDR
     */
    casparRoutes.ddrPrevious = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.previous()
        res.json(apiReturn.successMessage('Ddr previous command sended'));
    },

    /**
     *  Set the autoplay mode on the DDR
     */
    casparRoutes.ddrAutoPlay = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.setAutoPlay(!ddr.getAutoPlay());
        res.json(apiReturn.successMessage('autoPlay toogled : '+ddr.getAutoPlay()));

    },

    /**
     *  Set the playlist loop mode on the DDR
     */
    casparRoutes.ddrPlaylistLoop = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        ddr.setPlaylistLoop(!ddr.getPlaylistLoop());
        res.json(apiReturn.successMessage('playlistLoop toogled : '+ddr.getPlaylistLoop()));
    },

    /**
     *  Get the current playlist of the ddr
     */
    casparRoutes.ddrGetPlaylist = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        res.json(cleanObject(ddr.getPlaylist()));
    },

    /**
     *  Get the current media of the ddr
     */
    casparRoutes.ddrGetCurrentMedia = function(req, res){
        const casparId = parseInt(req.params.casparId);
        const ddrId = parseInt(req.params.ddrId);
        let ddr = caspars.get(casparId).getProducer(ddrId);
        res.json(cleanObject(ddr.getCurrentMedia()));
    },


    /**
    * _____________________________________________________________________________________________________________________________
    *
    * PLAYLIST manipulation
    */

    /**
     *  Adding a playlist to a DDR
     */
    casparRoutes.playlistAdd = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);
        const settings = req.body;

        let playlist = caspar.addPlaylist(settings);

        if (playlist instanceof Playlist ){
            // playlists.set(playlist.getId(), playlist);
            res.json(cleanObject(playlist));
        }else{
            res.json(apiReturn.requestErrorMessage('Failed to create Playlist'));
        }
    },

    /**
     *  Check if the playlist id is valid
     */
    casparRoutes.playlistCheck = function(req, res, next) {
        console.log('playlistCheck');
        const casparId = parseInt(req.params.casparId);
        const playlistId = parseInt(req.params.playlistId);
        let playlist = caspars.get(casparId).getPlaylist(playlistId);
        if(playlist instanceof Playlist){
            next();
            console.log('playlistCheck ok')
        }else{
            res.json(apiReturn.notFoundMessage('Playlist instance not found'));
        }
    },

    /**
     *  Delete a playlist instance
     */
    casparRoutes.playlistDelete = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        const playlistId = parseInt(req.params.playlistId);
        let playlist = caspars.get(casparId).getPlaylist(playlistId);
        if(playlist instanceof Playlist){
            let result = caspars.get(casparId).removePlaylist(playlistId);
            if (result){
                res.json(apiReturn.successMessage('Playlist deleted'));
                // socket.emit('layerDelete', JSON.stringify(layer));
            }else{
                res.json(apiReturn.notFoundMessage('Unable to delete playlist'));
            }
        }else{
            res.json(apiReturn.notFoundMessage('Playlist instance not found'));
        }
    },

    /**
     *  Add a file to a playlist
     */
    casparRoutes.playlistAddFile = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        const playlistId = parseInt(req.params.playlistId);
        const mediaId = parseInt(req.params.fileId);
        let playlist = caspars.get(casparId).getPlaylist(playlistId);

        let result = playlist.addMedia(mediaId);

        if (result instanceof Media){
            res.json(apiReturn.successMessage('Media Added'));
            socket.emit('playlistEdit',JSON.stringify(cleanObject(playlist)));
        }else{
            res.json(apiReturn.notFoundMessage('Media not found'));
        }
    },

     /**
     *  Remove a file from a playlist
     */
    casparRoutes.playlistRemoveFile = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        const playlistId = parseInt(req.params.playlistId);
        const index = parseInt(req.params.index);
        let playlist = caspars.get(casparId).getPlaylist(playlistId);

        let result = playlist.removeMedia(index);

        if (result) {
            res.json(apiReturn.successMessage('Media Removed'));
            socket.emit('playlistEdit',JSON.stringify(cleanObject(playlist)));
        }else{
            res.json(apiReturn.notFoundMessage('Media not found'));
        }
    },

    /**
     *  Get the array containing the files of the playlist
     */
    casparRoutes.playlistGetFiles = function(req, res) {
        const casparId = parseInt(req.params.casparId);
        const playlistId = parseInt(req.params.playlistId);
        let playlist = caspars.get(casparId).getPlaylist(playlistId);
        let array = [...playlist.getList()];
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        res.json(array);
    },


    /**
    * _____________________________________________________________________________________________________________________________
    *
    * Medias manipulation
    */
    casparRoutes.scanMedias = async function (req, res){
        const casparId = parseInt(req.params.casparId);
        const caspar = caspars.get(casparId);

        await caspar.scanMedias();
        let array = [...caspar.getMedias()]
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        res.json(array);
    }




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

    /**
     * Transform the OSC protocol buffer octet stream in parsed readable string
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

        var result = new Map();                                                             // dictionnaire contenant les données récoltées.
        var bufferLength = buffer.length;                                                   //longeur totale du buffer
        var cursor = 16;                                                                    // on place le curseur à la taille de premier élément
        while(cursor < bufferLength){                                                       // tant qu'il reste des données dans le buffer
            var elementSize = buffer.readInt32BE(cursor);                                   // on récupère la longueur de l'élément
            cursor = cursor + 4;                                                            // on place le curseur au début de l'élément
            var element = buffer.slice(cursor, cursor+elementSize);                         // on récupère l'élément en entier
            // traitement de l'élément
            var valName = element.toString('utf-8').split(',')[0];
            var valNameLength = valName.length;
                valName = valName.replace(/\0/g,'');
            var valType = element.slice(valNameLength+1, valNameLength+2).toString();
            var valData = element.slice(valNameLength+2);

            switch(valType){                                                                // formattage des valeurs en fonction des types
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
            cursor = cursor + elementSize;                                                  // incrémentation du curseur
        }
        this.oscRouter(result, rinfo['address']);
        return result;
    }

    /**
     * Route a osc message on the correct caspar instance
     * @param {*} msg                   msg to be routed
     * @param {*} sourceIpAddr          source ipAddr of the osc message
     */
    casparRoutes.oscRouter = function (msg, sourceIpAddr){
        caspars.forEach(function(caspar, casparId, map){
            const ipAddr = caspar.getCasparCommon().getIpAddr();
            if (ipAddr == sourceIpAddr){
                let result = caspar.oscAnalyzer(msg);
                if (result){                                                                // envoi de socketIO
                    socket.emit(result[0],JSON.stringify(cleanObject(result[1])));
                }
            }
        });
    }

    return casparRoutes;
}
