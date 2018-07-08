const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

const CasparDdr = require('../Caspar/Producers/CasparProducerDdr.js');
const CasparMedia = require('../Caspar/Producers/CasparMedia.js');
const CasparPlaylist = require('../Caspar/Producers/CasparPlaylist.js');
const CasparCommon = require('../Caspar/CasparCommon.js');

var http =  require('http');

let media1;

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
   
});


function ini() {
    let ddr = new CasparDdr(new Array());
    

    let mediaSettings = new Array();
        mediaSettings['name'] = 'media1';
        mediaSettings['fullPath'] ="./media1";
        media1 = new CasparMedia(mediaSettings);
    let media2 = new CasparMedia(mediaSettings);
        media2.name = 'media2';
    let media3 = new CasparMedia(mediaSettings);
        media3.name = 'media3';

    const mediaList = new Map();
            mediaList.set( media1.getId(),  media1);
            mediaList.set( media2.getId(),  media2);
            mediaList.set( media3.getId(),  media3);

            let casparCommon = new CasparCommon(new Array());
            casparCommon.setMedias(mediaList);
            casparCommon.setMvId(1);

    casparCommon.socketIo = io;
    
    ddr.setCasparCommon(casparCommon);
    ddr.getPlaylist().setCasparCommon(casparCommon);
    ddr.getPlaylist().addMedia(media1.id);
    ddr.getPlaylist().addMedia(media2.id);
    ddr.getPlaylist().addMedia(media3.id);
    ddr.id = 1;

    return ddr;
}

describe('run()', function (){

    it("Should return error message when no media in playlist", async function(){
        let ddr = new CasparDdr(new Array());
        let result = await ddr.run()
        expect(result).toBe('no media in the playlist');
            
    })


    it("Should return load when media player", async function(){
        let ddr = ini();
            ddr.setAutoPlay(false);
        let result = await ddr.run();

        expect(result[0].command).toBe('LOAD 1-1 /media1');

        
    })

    it("Should return load when media player", async function(){
        let ddr = ini();
        let result = await ddr.run();
        expect(result[0].command).toBe('LOAD 1-1 /media1 AUTO');

    })
})

describe('resume()', function (){
    it("should return the resume request and loadBG request", async function(){
        let ddr = ini();
        let result = await ddr.resume()
        expect(result[0].command).toBe('PLAY 1-1 /media1');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');

    })  

    it("should return the resume request only", async function(){
        let ddr = ini();
        let result = await ddr.resume()
        expect(result[0].command).toBe('PLAY 1-1 /media1');
    })  
})

describe('pause()', function (){
    it("should return the pause request", async function(){
        let ddr = ini();
        let result = await ddr.pause();
        expect(result[0].command).toBe('PAUSE 1-1');
    })  
})

describe('stop()', function (){
    it("Should return the stop request", async function(){
        let ddr = ini();
        let result = await ddr.stop()
        expect(result[0].command).toBe('STOP 1-1');
    })  

})

describe('playId()', function (){
    it("Should return the load request when player is paused", async function(){
        let ddr = ini();
        let result = await ddr.playId(0);
        expect(result[0].command).toBe('LOAD 1-1 /media1 AUTO');
    })  
})


describe('seek()', function (){

    it("Should return the load seek request when player is paused ", async function(){
        let ddr = ini();
            await ddr.resume();
        let result = await ddr.seek(500);
        expect(result[0]).toBe('no media loaded !');
    })  

    it("Should return the play seek request when player is paused", async function(){
        let ddr = ini();
            ddr.setCurrentMedia(media1);
                ddr.setCurrentIndex(0);
        let result = await ddr.seek(500);
        expect(result[0].command).toBe('LOAD 1-1 /media1 AUTO SEEK 500');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');
    })  
})

describe('next()', function (){

    it("Should return and error message if the playlist is empty", async function(){
        let ddr = ini();
        ddr.getPlaylist().setList(new Array());
        let result = await ddr.next();
        expect(result[0]).toBe('ERROR : next index and current index are the same');
    })  

    it("Should return LOAD request when ddr is paused", async function(){
        let ddr = ini();
        let result = await ddr.next();
        expect(result[0].command).toBe('LOAD 1-1 /media1 AUTO');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');
    })  

    it("Should return PLAY request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.setPaused(false);
        let result = await ddr.next();
        expect(result[0].command).toBe('PLAY 1-1 /media1');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');
    })   

    it("Should return PLAY request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.setPaused(false);
            ddr.setAutoPlay(false);
        let result = await ddr.next();
        expect(result[0].command).toBe('PLAY 1-1 /media1');
        expect(result[1]).toBe(undefined);
    })   

})

describe('previous()', function (){

    it("Should return and error message if the playlist is empty", async function(){
        let ddr = ini();
        ddr.getPlaylist().setList(new Array());
        let result = await ddr.previous();
        expect(result[0]).toBe('ERROR : next index and current index are the same');
    })  

    it("Should return LOAD request when ddr is paused", async function(){
        let ddr = ini();
            ddr.currentIndex = 1;
            ddr.nextIndex = 0;
        let result = await ddr.previous();
        console.log(result);
        expect(result[0].command).toBe('LOAD 1-1 /media1 AUTO');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');
    })  

    it("Should return PLAY request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.currentIndex = 1;
            ddr.nextIndex = 0;
            ddr.setPaused(false);
        let result = await ddr.previous();
        expect(result[0].command).toBe('PLAY 1-1 /media1');
        expect(result[1].command).toBe('LOADBG 1-1 /media1 AUTO');
    })   

    it("Should return PLAY request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.currentIndex = 1;
            ddr.nextIndex = 0;
            ddr.setPaused(false);
            ddr.setAutoPlay(false);
        let result = await ddr.previous();
        expect(result[0].command).toBe('PLAY 1-1 /media1');
        expect(result[1]).toBe(undefined);
    })   

})


describe('playRequest()', function (){

    it("Should return PLAY request when ddr is not paused", async function(){
        let ddr = ini();
        let result = ddr.playRequest(1);
        expect(result).toBe('PLAY 1-1 /media1');
    });
});


describe('loadRequest()', function (){

    it("Should return LOAD request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = false;
        let result = ddr.loadRequest(1);
        expect(result).toBe('LOAD 1-1 /media1');
    });
    it("Should return LOAD request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = true;
        let result = ddr.loadRequest(1);
        expect(result).toBe('LOAD 1-1 /media1 AUTO');
    });
    it("Should return LOAD request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = true;
            ddr.mediaLoop = true;
        let result = ddr.loadRequest(1);
        expect(result).toBe('LOAD 1-1 /media1 LOOP AUTO');
    });
});

describe('loadBgRequest()', function (){

    it("Should return LOAD request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = false;
        let result = ddr.loadBgRequest(1);
        expect(result).toBe('LOADBG 1-1 /media1');
    });
    it("Should return LOADBG request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = true;
        let result = ddr.loadBgRequest(1);
        expect(result).toBe('LOADBG 1-1 /media1 AUTO');
    });
    it("Should return LOADBG request when ddr is not paused", async function(){
        let ddr = ini();
            ddr.autoPlay = true;
            ddr.mediaLoop = true;
        let result = ddr.loadBgRequest(1);
        expect(result).toBe('LOADBG 1-1 /media1 LOOP AUTO');
    });
});

describe('indexVerify()', function (){

    it("Should return the current index when at the end of the playlist", async function(){
        let ddr = ini();
           
        let result =  ddr.indexVerify(1);
        expect(result).toBe(1);
    });
    it("Should return the last index of the playlist", async function(){
        let ddr = ini();
        let result =  ddr.indexVerify(3);
        expect(result).toBe(ddr.playlist.getList().length -1);
    });

    it("Should return the first index of the playlist", async function(){
        let ddr = ini();
        ddr.playlistLoop = true;
        let result =  ddr.indexVerify(3);
        expect(result).toBe(0);
    })
    it("Should return the last index of the playlist", async function(){
        let ddr = ini();
        ddr.playlistLoop = true;
        let result =  ddr.indexVerify(-1);
        expect(result).toBe(ddr.playlist.getList().length -1);
    })

});



describe('edit()', function (){
    let ddr = ini();

    it("Should return a the edited name object", function(){

        let result = ddr.edit('name', 'editedName');

        let object = new Object;
            object.name = 'editedName';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })

    it("Should return a the edited name object", function(){
        let settings = new Array();
            settings.name = 'test';
        let playlist = new CasparPlaylist(settings);
        let result = ddr.edit('playlist', playlist);

        let object = new Object;
            object.playlist = playlist;

        expect(result.playlist.id).toBe(object.playlist.id);
        expect(result.playlist.name).toBe(object.playlist.name);
    })
   
    it("Should return a the edited playlistLoop object", function(){

        let result = ddr.edit('playlistLoop', false);

        let object = new Object;
            object.playlistLoop = false;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));

        result = ddr.edit('playlistLoop', true);

        object = new Object;
            object.playlistLoop = true;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })

    it("Should return a the edited mediaLoop object", function(){

        let result = ddr.edit('mediaLoop', false);

        let object = new Object;
            object.mediaLoop = false;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));

        result = ddr.edit('mediaLoop', true);

        object = new Object;
            object.mediaLoop = true;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })

    it("Should return a the edited name object", function(){
            ddr.nextIndex = 0;
        let result = ddr.edit('autoPlay', false);


        let object = new Object;
            object.autoPlay = false;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));

        result = ddr.edit('autoPlay', true);

        object = new Object;
            object.autoPlay = true;

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
    it("Should return a the edited not found object", function(){

        let result = ddr.edit('random', 'editedName');

        let object = new Object;
            object.random = 'not found';

        expect(JSON.stringify(result)).toBe(JSON.stringify(object));
    })
   
});


describe('timeFormat()', function (){
    let ddr = ini();

    it("Should return a the formatted time", function(){

        let result = ddr.timeFormat(60);
        expect(result).toBe('00:01:00');

        result = ddr.timeFormat(3600);
        expect(result).toBe('01:00:00');
    })

})

describe('setFileTime()', function (){
    it("Should increment media index", function(){
        let ddr = ini();
            ddr.currentIndex = 0;
            ddr.nextIndex = 1;
            ddr.fileTime = 100;

            ddr.setFileTime(2);

            expect(ddr.currentIndex).toBe(1);
    })
    it("Should not increment media index", function(){
        let ddr = ini();
            ddr.currentIndex = 0;
            ddr.nextIndex = 1;
            ddr.fileTime = 100;

            ddr.setFileTime(200);

            expect(ddr.currentIndex).toBe(0);
    })
})