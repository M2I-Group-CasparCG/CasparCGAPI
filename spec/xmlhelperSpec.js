var Helper = require('../XMLHandler/bin/xmlhelper.js');
var fs = require('fs');
const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config'

try {
    if(fs.existsSync(pathConfig)){
        fs.unlinkSync(pathConfig);
    };
    fs.writeFileSync(pathConfig, fs.readFileSync(appRoot + '/spec/caspar_config.master', 'utf-8'), 'utf-8');
} catch (error) {
    console.log(error);
}

describe('getXmlValue()', function (){
    it("The function should return an xml value of 6250", function(){
        var value = new Helper(appRoot + '/spec/caspar.config').getXMLValue('default-port');
        expect(value).toBe('6250');
    })
});

describe('checkCustomSettingsNode()', function(){
    it("The function should return true as the custom settings node is set during new Helper()", function(){
        var value = new Helper(appRoot + '/spec/caspar.config').checkCustomSettingsNode();
        expect(value).toBeTruthy();
    })
});

describe('getSettingsArray()', function(){
    it("The function should return an array of values", function() {
        var valuesArray = new Helper(appRoot + '/spec/caspar.config').getSettingsArray();
        function testArray(valuesArray) {
            if(valuesArray['amcpPort']!=='5250'){
                return new String("amcpPort value is " + valuesArray['amcpPort'] + " should be 5250");
            }
            if(valuesArray['logPath']!=='log'){
                return new String("logPath value is " + valuesArray['logPath'] + " should be 'log'");
            }
            if(valuesArray['mediaPath']!=='media'){
                return new String("mediaPath value is " + valuesArray['mediaPath'] + " should be 'media'");
            }
            if(valuesArray['templatePath']!=='templates'){
                return new String("templatePath value is " + valuesArray['templatePath'] + " should be 'templates'");
            }
            if(valuesArray['thumbnailsPath']!=='thumbnails'){
                return new String("thumbnailsPath value is " + valuesArray['thumbnailsPath'] + " should be 'thumbnails'");
            }
            if(valuesArray['name']!=='default'){
                return new String("name value is " + valuesArray['name'] + " should be 'default'");
            }
            if(valuesArray['ipAddr']!=='127.0.0.1'){
                return new String("ipAddr value is " + valuesArray['ipAddr'] + " should be '127.0.0.1'");
            }
            if(valuesArray['oscDefaultPort']!=='6250'){
                return new String("oscDefaultPort value is " + valuesArray['oscDefaultPort'] + " should be '6250'");
            }
            return true;
        }
        var value = testArray(valuesArray);
        expect(value).toBe(true, value);
    })
})

