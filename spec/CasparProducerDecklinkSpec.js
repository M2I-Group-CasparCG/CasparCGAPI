const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ProducerDecklink = require('../Caspar/Producers/CasparProducerDecklink.js');
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
        casparCommon.mvId = 1;

    let settings = new Array();
        
        settings.decklinkId = 1;
    let decklink = new ProducerDecklink(settings);
        decklink.setCasparCommon(casparCommon);

    return decklink;
}

describe('run()', function (){
    it('Should return the run command', async function(){
        let decklink = ini();
        let result = await decklink.run();
        expect(result[0].command).toBe(`PLAY 1-${decklink.id} DECKLINK 1`);
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let decklink = ini();
        let result = await decklink.stop();
        expect(result[0].command).toBe(`STOP 1-${decklink.id} DECKLINK 1`);
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

        let result = decklink.edit('latency', 1);

        let object = new Object;
            object.latency = 1;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('latency', 1);

        let object = new Object;
            object.latency = 1;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('channelLayout', ['test','test']);

        let object = new Object;
            object.channelLayout = ['test','test'];

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = decklink.edit('embeddedAudio', true);

        let object = new Object;
            object.embeddedAudio = true;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited not found object", function(){

        let result = decklink.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

