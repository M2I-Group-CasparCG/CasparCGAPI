var test = require('unit.js')
var assert = require('assert');
var Caspar = require('../Caspar.js');
var Channel = require('../CasparChannel');
var Producer = require('../Producers/CasparProducer.js');
var Consumer = require('../Consumers/CasparConsumer.js');

describe('Caspar.js', function(){

    let caspar = new Caspar(new Array());
    let element = null;
    let id = 0;

    /**
     * CHANNELS
     */

    it('addChannel', function(){
        element = caspar.addChannel(new Array());
        assert.ok(element instanceof Channel);
        assert.equal(caspar.getChannels().size, 1);
        id = element.getId();
    });

    it('getChannel', function(){
        assert.equal(caspar.getChannel(id),element);
    });

    it('getChannels', function(){
        assert.ok(caspar.getChannels() instanceof Map);
        assert.ok(caspar.getChannels().values().next().value instanceof Channel); 
    });

    it('removeChannel', function(){
        let channelNb = caspar.getChannels().size;
        caspar.removeChannel(id);
        assert.equal(channelNb-1, caspar.getChannels().size);
    });

    /**
     * PRODUCERS
     */

    it('addProducer', function(){
        element = caspar.addProducer(new Array());
        assert.ok(element instanceof Producer);
        assert.equal(caspar.getProducers().size, 1);
        id = element.getId();
    });

    it('getProducer', function(){
        assert.equal(caspar.getProducer(id),element);
    });

    it('getProducers', function(){
        assert.ok(caspar.getProducers() instanceof Map);
        assert.ok(caspar.getProducers().values().next().value instanceof Producer); 
    });

    it('removeProducer', function(){
        let channelNb = caspar.getProducers().size;
        caspar.removeProducer(id);
        assert.equal(channelNb-1, caspar.getProducers().size);
    });

    /**
     * CONSUMERS
     */

    it('addConsumer', function(){
        element = caspar.addConsumer(new Array());
        assert.ok(element instanceof Consumer);
        assert.equal(caspar.getConsumers().size, 1);
        id = element.getId();
    });

    it('getConsumer', function(){
        assert.equal(caspar.getConsumer(id),element);
    });

    it('getConsumers', function(){
        assert.ok(caspar.getConsumers() instanceof Map);
        assert.ok(caspar.getConsumers().values().next().value instanceof Consumer); 
    });

    it('removeConsumer', function(){
        let channelNb = caspar.getConsumers().size;
        caspar.removeConsumer(id);
        assert.equal(channelNb-1, caspar.getConsumers().size);
    });
   

    


}); 