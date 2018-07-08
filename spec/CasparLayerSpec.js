const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';


var Layer = require('../Caspar/CasparLayer.js');
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
        settings.channelId = 1;

    let layer = new Layer(settings);
        layer.setCasparCommon(casparCommon);

    return layer;
}

describe('setInput()', function (){
    it('Should an empty array when stopped', async function(){
        let layer = ini();
        let result = await layer.setInput(1000);
        expect(result[0]).toBe('not started');
    });

    it('Should an the play command', async function(){
        let layer = ini();
            layer.started = true;
        let result = await layer.setInput(1000);
        expect(result[0].command).toBe('PLAY 1-0 route://1-1000');
    });
});

describe('start()', function (){
    it('Should an empty array when stopped', async function(){
        let layer = ini();
            layer.selectedInput = 200;
        let result = await layer.start();
        expect(result[0].command).toBe('PLAY 1-0 route://1-200');
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let layer = ini();
        let result = await layer.stop();
        expect(result[0].command).toBe(`STOP 1-${layer.layerId}`);
    });
});


describe('edit()', function (){
    let layer = ini();

    it("Should return a the edited name object", function(){

        let result = layer.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('layerId', 1000);

        let object = new Object;
            object.layerId = 1000;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('producerId', 500);

        let object = new Object;
            object.producerId = 500;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('channelId', 200);

        let object = new Object;
            object.channelId = 200;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('posX', 100);

        let object = new Object;
            object.posX = 100;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('posY', 50);

        let object = new Object;
            object.posY = 50;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('scaleX', 30);

        let object = new Object;
            object.scaleX = 30;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = layer.edit('scaleY', 20);

        let object = new Object;
            object.scaleY = 20;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited not found object", function(){

        let result = layer.edit('random', 'zfepioijzef');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

