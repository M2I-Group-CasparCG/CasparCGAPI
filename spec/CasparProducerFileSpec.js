const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

var ProducerFile = require('../Caspar/Producers/CasparProducerFile.js');
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
        
        settings.fileName = 'test.mov';
    let file = new ProducerFile(settings);
        file.setCasparCommon(casparCommon);

    return file;
}

describe('run()', function (){
    it('Should return the run command', async function(){
        let file = ini();
        let result = await file.run();
        expect(result[0].command).toBe(`PLAY 1-${file.id} test.mov loop`);
    });
});

describe('stop()', function (){
    it('Should return the stop command', async function(){
        let file = ini();
        let result = await file.stop();
        expect(result[0].command).toBe(`STOP 1-${file.id}`);
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
    it("Should return a the edited list object", function(){

        let result = file.edit('fileName', 'test');

        let object = new Object;
            object.fileName = 'test';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited list object", function(){

        let result = file.edit('playMode', 'test2');

        let object = new Object;
            object.playMode = 'test2';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })

    it("Should return a the edited not found object", function(){

        let result = file.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});

