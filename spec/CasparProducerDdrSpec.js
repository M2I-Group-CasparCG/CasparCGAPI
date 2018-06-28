const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

const CasparDdr = require('../Caspar/Producers/CasparProducerDdr.js');
const CasparMedia = require('../Caspar/Producers/CasparMedia.js');
const CasparCommon = require('../Caspar/CasparCommon.js');


let media1;

beforeEach(() => {
   
});

afterEach(() => {

});


function ini() {
    let ddr = new CasparDdr(new Array());
    

    let mediaSettings = new Array();
        mediaSettings['name'] = 'name';
        media1 = new CasparMedia(mediaSettings);
    let media2 = new CasparMedia(mediaSettings);
    let media3 = new CasparMedia(mediaSettings);

    const mediaList = new Map();
            mediaList.set( media1.getId(),  media1);
            mediaList.set( media2.getId(),  media2);
            mediaList.set( media3.getId(),  media3);

            let casparCommon = new CasparCommon(new Array());
            casparCommon.setMedias(mediaList);
            casparCommon.setMvId(1);
    
    ddr.setCasparCommon(casparCommon);
    ddr.getPlaylist().setCasparCommon(casparCommon);
    ddr.getPlaylist().addMedia(media1.id);
    ddr.id = 1;

    return ddr;
}

describe('run()', function (){
    it("Should return false", async function(){
        let ddr = new CasparDdr(new Array());
        let result = '';
        await ddr.run()
            .then(
                function(resolve){
                    result = resolve;
                },
                function(reject){
                    result = reject;
                }
            )
        expect(result).toBe('no media in the playlist');
    })


    it("Should return the correct request", async function(){
        let ddr = ini();
        let result = '';
        await ddr.run()
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
             )
        expect(result.command).toBe('LOAD 1-1 /name');
    })

    it("Should return the correct request", async function(){
        let ddr = ini();
            ddr.setPaused(false);
            ddr.setAutoPlay(false);
        let result = '';
        await ddr.run()
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            )
        expect(result.command).toBe('PLAY 1-1 /name');
    })
})

describe('resume()', function (){
    it("Should return the correct request", async function(){
        let ddr = ini();
        let result = '';
        await ddr.resume()
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            );
        expect(result.command).toBe('RESUME 1-1');
    })  
})

describe('pause()', function (){
    it("Should return the correct request", async function(){
        let ddr = ini();
        let result = '';
        await ddr.pause()
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            );
        expect(result.command).toBe('PAUSE 1-1');
    })  
})

describe('stop()', function (){
    it("Should return the correct request", async function(){
        let ddr = ini();
        let result = '';
        await ddr.stop()
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            );
        expect(result.command).toBe('STOP 1-1');
    })  
})

describe('playId()', function (){
    it("Should return the correct request", async function(){
        let ddr = ini();
        let result = '';
        await ddr.playId(0)
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            );
        expect(result.command).toBe('LOAD 1-1 /name');
    })  

    it("Should return the correct request", async function(){
        let ddr = ini();
            ddr.setPaused(false);
        let result = '';
        await ddr.playId(0)
            .then(
                function(resolve){
                    result = resolve;
                },function(reject){
                    result = reject;
                }
            );
        expect(result.command).toBe('PLAY 1-1 /name');
    })  
})