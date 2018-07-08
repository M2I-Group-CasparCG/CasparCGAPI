const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ConsumerFile = require('../Caspar/Consumers/CasparConsumerFile.js');
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
    let file = new ConsumerFile(settings);
        file.setCasparCommon(casparCommon);

    return file;
}

describe('run()', function (){
    it('Should return the run command', async function(){
        let file = ini();
        let result = await file.run();
        expect(result[0].command).toBe('ADD 1 FILE defaultVideoFile.mp4');
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let file = ini();
        let result = await file.stop();
        expect(result[0].command).toBe('REMOVE 1 FILE  defaultVideoFile.mp4');
    });
});


describe('edit()', function (){
    let file = ini();

    it("Should return a the edited name object", function(){

        let result = file.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = file.edit('channelId', 'editChannelId');

        let object = new Object;
            object.channelId = 'editChannelId';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = file.edit('fileName', 'editedFileName');

        let object = new Object;
            object.fileName = 'editedFileName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited name object", function(){

        let result = file.edit('filePath', 'editedfilePath');

        let object = new Object;
            object.filePath = 'editedfilePath';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
    it("Should return a the edited not found object", function(){

        let result = file.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

