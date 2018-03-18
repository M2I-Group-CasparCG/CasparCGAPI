
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

var caspar = {

    connect : function(req, res){
        let casparSettings = req.body;
        let caspar = new Caspar(casparSettings);
            caspar.getCasparCommon().tcpPromise('CLEAR 1-1000').then(
                function(result){
                    // si la requête est un succès
                    if(result.indexOf('202') === 0){
                        caspar.getCasparCommon().setOnline(true);
                    }else if (result == 'timeout'){
                        caspar.getCasparCommon().setOnline(false);
                    }
                    caspars.set(caspar.getId(), caspar)
                    res.json(caspar);
                })
    },

    check : function(req, res, next){
        console.log('check');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
        if(caspar instanceof Caspar){
            next();
        }else{
            res.sendStatus('404');
        }
    },

    ini : function(req, res, next) {
        console.log('ini');
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            caspar.ini();
            res.sendStatus('202');
    },
    
    /**
     * Consumers
     * 
     */
    
    consumerAdd : function(req,res,next){
        console.log('addConsumer');
        let consumerSettings = req.body;
        let consumer = new ConsumerScreen(consumerSettings);
        consumers.set(consumer.getId(), consumer);
        const casparId = req.params.casparId;
        let caspar = caspars.get(parseInt(casparId));
            caspar.addConsumer(consumer);
        res.json(consumer);
    },

    consumerCheck : function(req,res,next){
        console.log('check');
        const consumerId = req.params.consumerId;
        let consumer = caspars.get(parseInt(casparId)).getCasparCommon().getConsumer(parseInt(consumerId));
        if(consumer instanceof Consumer){
            next();
        }else{
            res.sendStatus('404');
        }
    },

    consumerStart : function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const consumerId = parseInt(req.params.consumerId);

        let consumer = caspars.get(casparId).getConsumer(consumerId);
            if (caspars.get(casparId).getChannel(consumer.getChannelId()) instanceof Channel){
                consumer.run();
                res.json(consumer);
            }else{
                let error = new Map();
                    error['errorType'] = "consumer not assigned to an existing channel";
                res.json(error);
            }        
    },


    /**
     * Producers
     * 
     */
    
     producerAdd : function(req, res){
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
        }else{
            let error = new Map();
                error['errorType'] = "unknown producer type";
            res.json(error);
        }
    },
    producerCheck : function(req,res,next){
        console.log('check');
        const producerId = req.params.producerId;
        let producer = caspars.get(parseInt(casparId)).getCasparCommon().getProducer(parseInt(producerId));
        if(producer instanceof Producer){
            next();
        }else{
            res.sendStatus('404');
        }
    },
    producerStart : function(req,res,next){
        console.log('startConsumer');

        const casparId = parseInt(req.params.casparId);
        const producerId = parseInt(req.params.producerId);

        let producer = caspars.get(casparId).getProducer(producerId);
            producer.run();
            res.sendStatus('202'); 
    },

     /**
     * Channels
     * 
     */

    channelCheck : function(req,res,next){
        const channelId = parseInt(req.params.channelId);
        next();

    },
    channelSwitch : function(req,res,next){
        const casparId = parseInt(req.params.casparId);
        const channelId = parseInt(req.params.channelId);
        const producerId = parseInt(req.params.producerId);

        caspars.get(casparId).getChannel(channelId).switchLayer(producerId);

        res.sendStatus('202');
    }

}

module.exports = caspar;