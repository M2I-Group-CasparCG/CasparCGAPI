const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ConsumerDecklink = require('../Caspar/Consumers/CasparConsumerDecklink.js');
const CasparCommon         = require('../Caspar/CasparCommon.js')

class Io {
    
    constructor(){
    }
    emit(){
    }
}


var io = new Io();

beforeEach(() => {


});

afterEach(() => {
   
})

function ini() {

    let casparCommon = new CasparCommon(new Array());
        casparCommon.socketIo = io;

    let settings = new Array();
        settings.channelId = 1;
    let decklink = new ConsumerDecklink(settings);
        decklink.setCasparCommon(casparCommon);

    return decklink;
}

describe('run()', function (){
    it('Should return the run command', async function(){
        let decklink = ini();
        let result = await decklink.run();
        expect(result[0].command).toBe('ADD 1 DECKLINK 1');
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let decklink = ini();
        let result = await decklink.stop();
        expect(result[0].command).toBe('REMOVE 1 DECKLINK 1');
    });
});

describe('setChannelId()', function (){
    it('Should return the return stop and run command', async function(){
        let decklink = ini();
        let result = await decklink.setChannelId(2);
        expect(result[0].command).toBe('REMOVE 1 DECKLINK 1');
        expect(result[1].command).toBe('ADD 2 DECKLINK 1');
    });
});

describe('edit()', function (){
    let decklink = ini();

    it("Should return a the edited name object", function(){

        let result = decklink.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('bufferDepth', 'test');

        let object = new Object;
            object.bufferDepth = 'test';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('decklinkId', 1);

        let object = new Object;
            object.decklinkId = 1;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('decklinkId', 1);

        let object = new Object;
            object.decklinkId = 1;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('latency', 1);

        let object = new Object;
            object.latency = 1;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited not found object", function(){

        let result = decklink.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

