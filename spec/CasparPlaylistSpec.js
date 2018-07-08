const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

const CasparMedia = require('../Caspar/Producers/CasparMedia.js');
const CasparPlaylist = require('../Caspar/Producers/CasparPlaylist.js');
const CasparCommon = require('../Caspar/CasparCommon.js');

describe('CasparPlaylist Tests', function () {

    let media1;
    let media2;
    let media3;

    let playlist;
    
    
    beforeEach(() => {

        let mediaSettings = new Array();
            mediaSettings['name'] = 'name';

        media1 = new CasparMedia(mediaSettings);
        media2 = new CasparMedia(mediaSettings);
        media3 = new CasparMedia(mediaSettings);

        const mediaList = new Map();
              mediaList.set( media1.getId(),  media1);
              mediaList.set( media2.getId(),  media2);
              mediaList.set( media3.getId(),  media3);

        const casparCommon = new CasparCommon(new Array());
            casparCommon.setMedias(mediaList);

        const playlistSettings = new Array();
            playlistSettings['name'] = 'playlistName';
            playlistSettings['casparCommon'] = casparCommon;
            playlist = new CasparPlaylist(playlistSettings);

    });

    afterEach(() => {

    });

    describe('constructor()', function (){
        it("Should return a playlist instance", function(){
            let result = new CasparPlaylist(new Array());
            expect(result instanceof CasparPlaylist).toBe(true);
        })
    });


    describe('addMedia()', function (){
        it("Should return a the added media", function(){

             // existing media
            let mediaId =  media1.getId();
            let result = playlist.addMedia(mediaId);
           
            expect(result).not.toBe(false);
            expect(result).toBe(media1);

        })
        it("Should return a false", function(){
            // non existing media
            result = playlist.addMedia(1000);
            expect(result).toBe(false);
        })
    });

    describe('insertMedia()', function (){
        it("Should return a the edit list media", function(){

            let mediaId =  media1.getId();
            playlist.addMedia(mediaId);

             // existing media
            let result = playlist.insertMedia(media2,0);
           
            expect(result).not.toBe(false);
            let array = [media2,media1];
            expect(JSON.stringify(result)).toBe(JSON.stringify(array));

        })
        it("Should return a false ", function(){
            // non existing media
            result = playlist.insertMedia(1000);
            expect(result).toBe(false);
        })
    });

    describe('getMedia()', function (){
        it("Should return a the requested media", function(){

            let mediaId =  media1.getId();
            playlist.addMedia(mediaId);
            mediaId =  media2.getId();
            playlist.addMedia(mediaId);
            

             // existing media
            let result = playlist.getMedia(1);
           
            expect(result).not.toBe(false);
            expect(result).toBe(media2);
        })
        it("Should return a false ", function(){
            // non existing media
            result = playlist.getMedia(1000);
            expect(result).toBe(false);
        })

    });

    describe('removeMedia()', function (){
        it("Should return a the edited media", function(){

            let mediaId =  media1.getId();
            playlist.addMedia(mediaId);
            mediaId =  media2.getId();
            playlist.addMedia(mediaId);
            mediaId =  media3.getId();
            playlist.addMedia(mediaId);
            

             // existing media
            let result = playlist.removeMedia(1);
           
            expect(result).not.toBe(false);
            let array = [media1, media3];
            expect(JSON.stringify(result)).toBe(JSON.stringify(array));
        })

        it("Should return a false ", function(){
            // non existing media
            result = playlist.removeMedia(1000);
            expect(result).toBe(false);
        })
    });
    
    describe('edit()', function (){

        it("Should return a the edited name object", function(){

            let result = playlist.edit('name', 'editedName');

            let object = new Object;
                object.name = 'editedName';

            expect(JSON.stringify(result)).toBe(JSON.stringify(object));
        })
        it("Should return a the edited list object", function(){

            let array = [media1, media3, media2];
            let result = playlist.edit('list', array);

            let object = new Object;
                object.list = array;

            expect(JSON.stringify(result)).toBe(JSON.stringify(object));
        })
        it("Should return a the edited not found object", function(){

            let result = playlist.edit('random', 'editedName');

            let object = new Object;
                object.random = 'not found';

            expect(JSON.stringify(result)).toBe(JSON.stringify(object));
        })
       
    });

})