const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

const CasparMedia = require('../Caspar/Producers/CasparMedia.js');
const CasparPlaylist = require('../Caspar/Producers/CasparPlaylist.js');

describe('CasparPlaylist Tests', function () {

    
    beforeEach(() => {

        const playlistSettings = new Array();
        playlistSettings['name'] = 'playlistName';
        const playlist = new CasparPlaylist(playlistSettings);

        const mediaNames = ['media1','media2','media3'];
        const medias = new Array();

        for (name in mediaNames){
            const settings = new Array();
            settings['name'] = name;
            settings['label'] = name+'Label';
            settings['path'] = './';
            medias.push(new CasparMedia(settings))
        }

    });

    afterEach(() => {

    });

    describe('addMedia()', function (){
        it("Should return a list with a single media", function(){

            const playlistSettings = new Array();
            playlistSettings['name'] = 'playlistName';
            const playlist = new CasparPlaylist(playlistSettings);
    
            const mediaNames = ['media1','media2','media3'];
            const medias = new Array();
    
            for (name in mediaNames){
                const settings = new Array();
                settings['name'] = name;
                settings['label'] = name+'Label';
                settings['path'] = './';
                medias.push(new CasparMedia(settings))
            }


            const result = playlist.addMedia(medias[1]);
            expect(result[0]).toBe(medias[1])

            const result2 = playlist.addMedia(medias[2]);
            expect(result[1]).toBe(medias[2])
        })
    });

    describe('insertMedia()', function (){
        it("Should return a list with a single media", function(){

            const playlistSettings = new Array();
            playlistSettings['name'] = 'playlistName';
            const playlist = new CasparPlaylist(playlistSettings);
    
            const mediaNames = ['media1','media2','media3'];
            const medias = new Array();
    
            for (name in mediaNames){
                const settings = new Array();
                settings['name'] = name;
                settings['label'] = name+'Label';
                settings['path'] = './';
                medias.push(new CasparMedia(settings))
            }


            const result = playlist.addMedia(medias[0]);

            const result2 = playlist.addMedia(medias[1]);

            const result3 = playlist.insertMedia(medias[2], 1)
            
            expect(result3[0]).toBe(medias[0]);
            expect(result3[1]).toBe(medias[2]);
            expect(result3[2]).toBe(medias[1]);


        })
    });

    describe('removeMedia()', function (){
        it("Should return a list with a single media", function(){

            const playlistSettings = new Array();
            playlistSettings['name'] = 'playlistName';
            const playlist = new CasparPlaylist(playlistSettings);
    
            const mediaNames = ['media1','media2','media3'];
            const medias = new Array();
    
            for (name in mediaNames){
                const settings = new Array();
                settings['name'] = name;
                settings['label'] = name+'Label';
                settings['path'] = './';
                medias.push(new CasparMedia(settings))
            }



            const result = playlist.addMedia(medias[0]);
            const result2 = playlist.addMedia(medias[1]);
            const result3 = playlist.insertMedia(medias[2], 1)
            

            const result4 = playlist.removeMedia(1);

            expect(result4[0]).toBe(medias[0]);
            expect(result4[1]).toBe(medias[1]);


        })
    });
    

})