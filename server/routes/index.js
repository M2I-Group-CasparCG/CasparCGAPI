
var http        =  require('http');
var dgram       = require('dgram');
var express     = require('express');
var router      = express.Router();
 
var auth        = require('./auth.js');


/**
 * instanciation socket.io
 */

var socketServer = http.createServer();
var io = require('socket.io').listen(socketServer);

    io.sockets.on('connection', function (socketIo) {           
        console.log("Browser connected...");	
    });

    socketServer.listen(3001);

    var casparRoutes    = require('./casparRoutes.js')(io);
    var hyperdeckRoutes = require('./HyperdeckRoutes.js')(io);

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
 * CASPAR ROUTES ----------------------------------------------------------
 */

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
    // router.get('/api/v1/caspars/:casparId/channels/:channelId/audioLevels', casparRoutes.channelGetAudioLevels);
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

    /**
     * DDR
     */
    router.all('/api/v1/caspars/:casparId/ddr/:ddrId/*', casparRoutes.ddrCheck);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/play', casparRoutes.ddrPlay);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/playId/:index', casparRoutes.ddrPlayId);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/seek/:frame', casparRoutes.ddrSeek);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/pause', casparRoutes.ddrPause);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/next', casparRoutes.ddrNext);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/previous', casparRoutes.ddrPrevious);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/autoPlay', casparRoutes.ddrAutoPlay);
    router.post('/api/v1/caspars/:casparId/ddr/:ddrId/playlistLoop', casparRoutes.ddrPlaylistLoop);
    router.get('/api/v1/caspars/:casparId/ddr/:ddrId/playlist', casparRoutes.ddrGetPlaylist)
    router.get('/api/v1/caspars/:casparId/ddr/:ddrId/file', casparRoutes.ddrGetCurrentMedia)

    /**
     * PLAYLIST
     */
    router.post('/api/v1/caspars/:casparId/playlists', casparRoutes.playlistAdd);
    router.all('/api/v1/caspars/:casparId/playlists/:playlistId/*', casparRoutes.playlistCheck);
    router.delete('/api/v1/caspars/:casparId/playlists/:playlistId/', casparRoutes.playlistDelete);
    router.post('/api/v1/caspars/:casparId/playlists/:playlistId/files/:fileId', casparRoutes.playlistAddFile);
    router.delete('/api/v1/caspars/:casparId/playlists/:playlistId/index/:index', casparRoutes.playlistRemoveFile);
    router.get('/api/v1/caspars/:casparId/playlists/:playlistId/files', casparRoutes.playlistGetFiles);

     /**
      * MEDIAS
      */
    router.post('/api/v1/caspars/:casparId/medias', casparRoutes.scanMedias);

    /**
     * XMLHandler
     */
    router.post('/api/v1/caspars/:casparId/settings/send', casparRoutes.setXmlValues);

/**
 * HYPERDECK ROUTES ----------------------------------------------------------
 */

    router.get('/api/v1/hyperdecks/', hyperdeckRoutes.getAll);
    router.post('/api/v1/hyperdecks/', hyperdeckRoutes.add);
    router.all('/api/v1/hyperdecks/:hyperdeckId/*', hyperdeckRoutes.check);
    router.delete('/api/v1/hyperdecks/:hyperdeckId/', hyperdeckRoutes.delete);
    router.get('/api/v1/hyperdecks/:hyperdeckId/:objectType/', hyperdeckRoutes.getAllObjects);
    router.post('/api/v1/hyperdecks/:hyperdeckId/scanDisks/', hyperdeckRoutes.scanDisks);
    router.post('/api/v1/hyperdecks/:hyperdeckId/infos/', hyperdeckRoutes.getInfos);
    router.post('/api/v1/hyperdecks/:hyperdeckId/controls/:control/', hyperdeckRoutes.control);


module.exports = router;