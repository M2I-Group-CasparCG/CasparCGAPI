
var http =  require('http');
var dgram =             require('dgram');
var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var caspar = require('./caspar.js');


/**
 * instanciation socket.io
 */

var socketServer = http.createServer();
var io = require('socket.io').listen(socketServer);

    io.sockets.on('connection', function (socketIo) {           
        console.log("Browser connected...");	
    });

    socketServer.listen(3001);

    var caspar = require('./caspar.js')(io);

/**
 * socket UDP pour CasparOSC
 */

let udpServer = dgram.createSocket('udp4');
    udpServer.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        udpServer.close();
    });

    udpServer.on('message', (msg, rinfo) => {
        let oscData = caspar.oscParser(msg, rinfo);
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
    router.get('/api/v1/caspars/', caspar.getAll);
    router.post('/api/v1/caspars/connect/', caspar.add);
    router.all('/api/v1/caspars/:casparId/*', caspar.check);
    router.get('/api/v1/caspars/:casparId/', caspar.get);
    router.put('/api/v1/caspars/:casparId/', caspar.edit);
    router.post('/api/v1/caspars/:casparId/ini/', caspar.ini);
    router.delete('/api/v1/caspars/:casparId/', caspar.delete);
    router.post('/api/v1/caspars/:casparId/restart', caspar.restart);

    router.put('/api/v1/caspars/:casparId/:objectType/:objectId/', caspar.editObject);
    router.get('/api/v1/caspars/:casparId/:objectType/:objectId/', caspar.getObject);
    router.get('/api/v1/caspars/:casparId/:objectType/', caspar.getAllObjects);


    /**
     * Consumers
     */
    router.post('/api/v1/caspars/:casparId/consumers/:consumerType', caspar.consumerAdd);
    router.all('/api/v1/caspars/:casparId/consumers/:consumerId/*', caspar.consumerCheck);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/start', caspar.consumerStart);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/stop', caspar.consumerStop);
    router.delete('/api/v1/caspars/:casparId/consumers/:consumerId/', caspar.consumerDelete);

    /**
     * Producers
     */
    router.post('/api/v1/caspars/:casparId/producers/:type', caspar.producerAdd);
    router.all('/api/v1/caspars/:casparId/producers/:producerId/*', caspar.producerCheck);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/start', caspar.producerStart);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/stop', caspar.producerStop);
    router.delete('/api/v1/caspars/:casparId/producers/:producerId/', caspar.producerDelete);

    /**
     * Channels
     */
    // router.post('/api/v1/caspars/:casparId/channels/', caspar.channelAdd)
    router.all('/api/v1/caspars/:casparId/channels:channelId/*', caspar.channelCheck);
    router.get('/api/v1/caspars/:casparId/channels/:channelId/audioLevels', caspar.channelGetAudioLevels);
    router.post('/api/v1/caspars/:casparId/channels/:channelId/producers/:producerId', caspar.channelSetInput);
 

    /**
     * Layers
     */
    router.post('/api/v1/caspars/:casparId/layers', caspar.layerAdd);
    router.all('/api/v1/caspars/:casparId/layers/:layerId/*', caspar.layerCheck);
    router.delete('/api/v1/caspars/:casparId/layers/:layerId', caspar.layerDelete);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/producers/:producerId', caspar.layerSetInput);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/start', caspar.layerStart);
    router.post('/api/v1/caspars/:casparId/layers/:layerId/stop', caspar.layerStop);
    // router.delete('/api/v1/caspars/:casparId/layers/:layerId', caspar.channelRemoveLayer);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/producers/:producerId', caspar.channelLayerSetInput);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/start', caspar.channelLayerStart);
    // router.post('/api/v1/caspars/:casparId/layers/:layerId/stop', caspar.channelLayerStop);


    // router.delete('/api/v1/casparcg/:casparId/channel/:channelId/:producerId', caspar.channelDelete);


  

    /**
     * XMLHandler
     */
    router.post('/api/v1/caspars/:casparId/settings/send', caspar.setXmlValues);
module.exports = router;