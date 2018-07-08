const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ProducerNet = require('../Caspar/Producers/CasparProducerNet.js');
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
        
        settings.url = 'rtp://127.0.0.1:5004';
    let net = new ProducerNet(settings);
        net.setCasparCommon(casparCommon);

    return net;
}

describe('run()', function (){
    it('Should return the run command', async function(){
        let net = ini();
        let result = await net.run();
        expect(result[0].command).toBe(`PLAY 1-${net.id} rtp://127.0.0.1:5004`);
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let net = ini();
        let result = await net.stop();
        expect(result[0].command).toBe(`STOP 1-${net.id}`);
    });
});


describe('edit()', function (){
    let net = ini();

    it("Should return a the edited name object", function(){

        let result = net.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = net.edit('url', 'test');

        let object = new Object;
            object.url = 'test';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited not found object", function(){

        let result = net.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

