
var http =  require('http');
var dgram =             require('dgram');
var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');


/**
 * instanciation socket.io
 */

var socketServer = http.createServer();
var io = require('socket.io').listen(socketServer);

    io.sockets.on('connection', function (socketIo) {           
        console.log("Browser connected...");	
    });

    socketServer.listen(3001);

    var casparRoutes= require('./casparRoutes.js')(io);

/**
 * socket UDP pour CasparOSC
 */

let udpServer = dgram.createSocket('udp4');
    udpServer.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        udpServer.close();
    });

    udpServer.on('message', (msg, rinfo) => {
        casparRoutes.oscParser(msg, rinfo);
    });

    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`udp server listening on ${address.address}:${address.port}`);
    });

    udpServer.bind(5253);



/*
 * Routes that can be accessed by any one
 */

    router.post('/login', auth.login);


    /**
     *  Caspar Settings
     */
    router.get('/api/v1/caspars/', casparRoutes.getAll);
    router.post('/api/v1/caspars/', casparRoutes.add);
    router.all('/api/v1/caspars/:casparId/*', casparRoutes.check);
    router.get('/api/v1/caspars/:casparId/', casparRoutes.get);
    router.put('/api/v1/caspars/:casparId/', casparRoutes.edit);
    router.post('/api/v1/caspars/:casparId/ini/', casparRoutes.ini);
    router.delete('/api/v1/caspars/:casparId/', casparRoutes.delete);
    router.post('/api/v1/caspars/:casparId/restart', casparRoutes.restart);

    router.put('/api/v1/caspars/:casparId/:objectType/:objectId/', casparRoutes.editObject);
    router.get('/api/v1/caspars/:casparId/:objectType/:objectId/', casparRoutes.getObject);
    router.get('/api/v1/caspars/:casparId/:objectType/', casparRoutes.getAllObjects);


    /**
     * Consumers
     */
    router.post('/api/v1/caspars/:casparId/consumers/:consumerType', casparRoutes.consumerAdd);
    router.all('/api/v1/caspars/:casparId/consumers/:consumerId/*', casparRoutes.consumerCheck);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/start', casparRoutes.consumerStart);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/stop', casparRoutes.consumerStop);
    router.delete('/api/v1/caspars/:casparId/consumers/:consumerId/', casparRoutes.consumerDelete);

    /**
     * Producers
     */
    router.post('/api/v1/caspars/:casparId/producers/:producerType', casparRoutes.producerAdd);
    router.all('/api/v1/caspars/:casparId/producers/:producerId/*', casparRoutes.producerCheck);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/start', casparRoutes.producerStart);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/stop', casparRoutes.producerStop);
    router.delete('/api/v1/caspars/:casparId/producers/:producerId/', casparRoutes.producerDelete);

    /**
     * Channels
     */
    // router.post('/api/v1/caspars/:casparId/channels/', casparRoutes.channelAdd)
    router.all('/api/v1/caspars/:casparId/channels/:channelId/*', casparRoutes.channelCheck);
    router.get('/api/v1/caspars/:casparId/channels/:channelId/audioLevels', casparRoutes.channelGetAudioLevels);
    router.post('/api/v1/caspars/:casparId/channels/:channelId/producers/:producerId', casparRoutes.channelSetInput);
    router.get('/api/v1/caspars/:casparId/channels/:channelId/layers', casparRoutes.channelLayersGetAll);
        // router.delete('/api/v1/casparcg/:casparId/channel/:channelId/:producerId', casparRoutes.channelDelete);

    /**
     * Layers
     */
    router.post('/api/v1/caspars/:casparId/layers', casparRoutes.layerAdd);
    router.all('/api/v1/caspars/:casparId/layers/:layerId/*', casparRoutes.layerCheck);
    router.delete('/api/v1/caspars/:casparId/layers/:layerId', casparRoutes.layerDelete);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/producers/:producerId', casparRoutes.layerSetInput);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/start', casparRoutes.layerStart);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/stop', casparRoutes.layerStop);
    // router.delete('/api/v1/caspars/:casparId/layers/:layerId', casparRoutes.channelRemoveLayer);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/producers/:producerId', casparRoutes.channelLayerSetInput);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/start', casparRoutes.channelLayerStart);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/stop', casparRoutes.channelLayerStop);


    /**
     * DDR
     */



    /**
     * PLAYLIST
     */

    
     /**
      * MEDIAS
      */
    router.post('/api/v1/caspars/:casparId/medias', casparRoutes.scanMedias);
    // router.get('/api/v1/caspars/:casparId/medias', casparRoutes.getMedias);
    // router.post('/api/v1/caspars/:casparId/medias/:mediaId', casparRoutes.getMedia);

    /**
     * XMLHandler
     */
    router.post('/api/v1/caspars/:casparId/settings/send', casparRoutes.setXmlValues);
module.exports = router;