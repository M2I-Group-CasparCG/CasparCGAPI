const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

const CasparMedia = require('../Caspar/Producers/CasparMedia.js');


let media;

beforeEach(() => {
    media = new CasparMedia(new Array());
});

afterEach(() => {

});

describe('timeFormat()', function (){
    it("Should return a formated time", function(){
        result = media.timeFormat(675000,0.24);
        expect(result).toBe('45:00:00:00');
    })
});


describe('sizeFormat()', function (){
    it("Should return a formated octet size", function(){
        result = media.sizeFormat(87363875);
        expect(result).toBe('87.36 Mo');
    })
});