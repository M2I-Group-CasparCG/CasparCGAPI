const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ConsumerNet = require('../Caspar/Consumers/CasparConsumerNet.js');
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
    let net = new ConsumerNet(settings);
        net.setCasparCommon(casparCommon);

    return net;
}



describe('run()', function (){
    it('Should return the run command', async function(){
        let net = ini();
        let result = await net.run();
        expect(result[0].command).toBe('ADD 1 STREAM udp://127.0.0.1:5004 -vcodec libx264 -tune zerolatency -preset ultrafast -crf 25 -format mpegts -vf scale=1920:1080');
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let net = ini();
        let result = await net.stop();
        expect(result[0].command).toBe('REMOVE 1 STREAM udp://127.0.0.1:5004');
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
    it("Should return a the edited name object", function(){

        let result = net.edit('channelId', 'editChannelId');

        let object = new Object;
            object.channelId = 'editChannelId';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('protocol', 'editedProtocol');

        let object = new Object;
            object.protocol = 'editedProtocol';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('host', 'editedHost');

        let object = new Object;
            object.host = 'editedHost';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('port', 'editedPort');

        let object = new Object;
            object.port = 'editedPort';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('vcodec', 'editVcodec');

        let object = new Object;
            object.vcodec = 'editVcodec';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('tune', 'edittune');

        let object = new Object;
            object.tune = 'edittune';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('preset', 'editedPreset');

        let object = new Object;
            object.preset = 'editedPreset';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('format', 'editedFormat');

        let object = new Object;
            object.format = 'editedFormat';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('pictureWidth', 1920);

        let object = new Object;
            object.pictureWidth = 1920;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('pictureHeight', 1080);

        let object = new Object;
            object.pictureHeight = 1080;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = net.edit('crf', 'editedCrf');

        let object = new Object;
            object.crf = 'editedCrf';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })

   
    it("Should return a the edited not found object", function(){

        let result = net.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

