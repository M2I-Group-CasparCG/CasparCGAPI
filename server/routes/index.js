var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var products = require('./products.js');
var user = require('./users.js');
var caspar = require('./caspar.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

// /*
//  * Routes that can be accessed only by autheticated users
//  */
// router.get('/api/v1/products', products.getAll);
// router.get('/api/v1/product/:id', products.getOne);
// router.post('/api/v1/product/', products.create);
// router.put('/api/v1/product/:id', products.update);
// router.delete('/api/v1/product/:id', products.delete);
 
// /*
//  * Routes that can be accessed only by authenticated & authorized users
//  */
// router.get('/api/v1/admin/users', user.getAll);
// router.get('/api/v1/admin/user/:id', user.getOne);
// router.post('/api/v1/admin/user/', user.create);
// router.put('/api/v1/admin/user/:id', user.update);
// router.delete('/api/v1/admin/user/:id', user.delete);


/**
 *  Caspar Settings
 */
router.post('/api/v1/casparcg/connect/', caspar.connect);
router.post('/api/v1/casparcg/:casparId/*', caspar.check);
router.post('/api/v1/casparcg/:casparId/ini/', caspar.ini);

/**
 * Consumers
 */
router.post('/api/v1/casparcg/:casparId/consumer/screen', caspar.consumerAdd);
router.post('/api/v1/casparcg/:casparId/consumer:consumerId/*', caspar.consumerCheck);
router.post('/api/v1/casparcg/:casparId/consumer/:consumerId/start', caspar.consumerStart);

/**
 * Producers
 */
router.post('/api/v1/casparcg/:casparId/producer/:type', caspar.producerAdd);
router.post('/api/v1/casparcg/:casparId/producer:producerId/*', caspar.producerCheck);
router.post('/api/v1/casparcg/:casparId/producer/:producerId/start', caspar.producerStart);

/**
 * Channels
 */
router.post('/api/v1/casparcg/:casparId/channel:channelId/*', caspar.channelCheck);
router.post('/api/v1/casparcg/:casparId/channel/:channelId/:producerId', caspar.channelSwitch);

module.exports = router;