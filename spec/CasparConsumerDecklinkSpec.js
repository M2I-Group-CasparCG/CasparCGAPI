const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ConsumerDecklink = require('../Caspar/Consumers/CasparConsumerDecklink.js');

const CasparCommon         = require('../Caspar/CasparCommon.js')

describe('CasparChannel Tests', function (){


    describe('run()', function (){
        it("Should...", function(){
            let consumerSetting = new Array();
            consumerSetting['decklinkId'] = 3;
            consumerSetting['channelId'] = 4;

            let consumerDecklink = new ConsumerDecklink(consumerSetting);
            let casparCommon = new CasparCommon(new Array());
            consumerDecklink.setCasparCommon(casparCommon);

            consumerDecklink.run()
                .then(
                    function(res){
                        expect(res.command).toBe(`ADD ${consumerSetting['channelId']} DECKLINK ${consumerSetting['decklinkId']}`);
                    },
                    function(rej){
                        expect(rej.command).toBe(`ADD ${consumerSetting['channelId']} DECKLINK ${consumerSetting['decklinkId']}`);
                    }
                )
        })
    });

    describe('stop()', function (){
        it("Should...", function(){
            
        })
    });

    describe('edit()', function (){
        it("Should return an object with th edited setting", function(){
            let consumerDecklink = new ConsumerDecklink(new Array());
            let edit = null;


            edit = consumerDecklink.edit('name', 'editedName');
            expect(Object.keys(edit)[0]).toBe('name');
            expect(Object.values(edit)[0]).toBe('editedName');

            edit = consumerDecklink.edit('bufferDepth', 'editBufferDepth');
            expect(Object.keys(edit)[0]).toBe('bufferDepth');
            expect(Object.values(edit)[0]).toBe('editBufferDepth');


            // edit = consumerDecklink.edit('channelId', 'editedChannelId');
            // expect(Object.keys(edit)[0]).toBe('channelId');
            // expect(Object.values(edit)[0]).toBe('editedChannelId');

            edit = consumerDecklink.edit('decklinkId', 'editedDecklinkId');
            expect(Object.keys(edit)[0]).toBe('decklinkId');
            expect(Object.values(edit)[0]).toBe('editedDecklinkId');

            edit = consumerDecklink.edit('latency', 'editedLatency');
            expect(Object.keys(edit)[0]).toBe('latency');
            expect(Object.values(edit)[0]).toBe('editedLatency');         

            edit = consumerDecklink.edit('unknown', 'bli');
            expect(Object.keys(edit)[0]).toBe('unknown');
            expect(Object.values(edit)[0]).toBe('not found');
    
        })
    });


});