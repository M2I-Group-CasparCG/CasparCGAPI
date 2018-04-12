
var http = require('http');
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

/*
 * Routes that can be accessed by any one
 */

    router.post('/login', auth.login);

    /**
     *  Caspar Settings
     */
    router.get('/api/v1/caspars/', caspar.getAll);
    router.post('/api/v1/caspars/connect/', caspar.connect);
    router.all('/api/v1/caspars/:casparId/*', caspar.check);
    router.get('/api/v1/caspars/:casparId/', caspar.get);
    // router.put('/api/v1/casparcg/:casparId/', caspar.edit);
    router.post('/api/v1/caspars/:casparId/ini/', caspar.ini);
    router.delete('/api/v1/caspars/:casparId/', caspar.delete);

    /**
     * Consumers
     */
    router.get('/api/v1/caspars/:casparId/consumers/', caspar.consumerGetAll)
    router.post('/api/v1/caspars/:casparId/consumers/screen', caspar.consumerAdd);
    router.all('/api/v1/caspars/:casparId/consumers:consumerId/*', caspar.consumerCheck);
    // router.put('/api/v1/casparcg/:casparId/producer/:producerId/', caspar.consumerEdit);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/start', caspar.consumerStart);
    router.post('/api/v1/caspars/:casparId/consumers/:consumerId/stop', caspar.consumerStop);
    router.delete('/api/v1/caspars/:casparId/consumers/:consumerId/', caspar.consumerDelete);

    /**
     * Producers
     */
    router.get('/api/v1/caspars/:casparId/producers/', caspar.producerGetAll)
    router.post('/api/v1/caspars/:casparId/producers/:type', caspar.producerAdd);
    router.all('/api/v1/caspars/:casparId/producers:producerId/*', caspar.producerCheck);
    // router.put('/api/v1/casparcg/:casparId/producer/:producerId/', caspar.producerEdit);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/start', caspar.producerStart);
    router.post('/api/v1/caspars/:casparId/producers/:producerId/stop', caspar.producerStop);
    router.delete('/api/v1/caspars/:casparId/producers/:producerId/', caspar.producerDelete);

    /**
     * Channels
     */
    router.get('/api/v1/caspars/:casparId/channels/', caspar.channelGetAll)
    // router.post('/api/v1/caspars/:casparId/channels/', caspar.channelAdd)
    router.all('/api/v1/caspars/:casparId/channels:channelId/*', caspar.channelCheck);
    // router.put('/api/v1/casparcg/:casparId/channel/:channelId/', caspar.channelEdit);
    router.post('/api/v1/caspars/:casparId/channels/:channelId/:producerId', caspar.channelSwitch);
    // router.delete('/api/v1/casparcg/:casparId/channel/:channelId/:producerId', caspar.channelDelete);

    /**
     * XMLHandler
     */
    router.post('/api/v1/caspars/:casparId/settings/send', caspar.setXmlValues);
module.exports = router;