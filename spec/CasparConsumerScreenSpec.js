const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ConsumerScreen = require('../Caspar/Consumers/CasparConsumerScreen.js');
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
    let screen = new ConsumerScreen(settings);
        screen.setCasparCommon(casparCommon);

    return screen;
}



describe('run()', function (){
    it('Should return the run command', async function(){
        let screen = ini();
        let result = await screen.run();
        expect(result[0].command).toBe(`ADD 1 SCREEN ${screen.id} name Consumer-Screen`);
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let screen = ini();
        let result = await screen.stop();
        expect(result[0].command).toBe(`REMOVE 1 SCREEN ${screen.id}`);
    });
});


describe('edit()', function (){
    let screen = ini();

    it("Should return a the edited name object", function(){

        let result = screen.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = screen.edit('channelId', 'editChannelId');

        let object = new Object;
            object.channelId = 'editChannelId';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = screen.edit('bufferDepth', 'editedBufferDepth');

        let object = new Object;
            object.bufferDepth = 'editedBufferDepth';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = screen.edit('channelName', 'editedChannelName');

        let object = new Object;
            object.channelName = 'editedChannelName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })   
    it("Should return a the edited not found object", function(){

        let result = screen.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

