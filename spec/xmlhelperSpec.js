var Helper = require('../XMLHandler/bin/xmlhelper.js');
var fs = require('fs');
const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config'


var jsonValues = {
    'settings' : {
        'AMCPPort' : '5251',
        'LogPath': 'log1',
        'MediaPath': 'media1',
        'OSCPort': '62501',
        'TemplatePath': 'templates1',
        'ThumbnailsPath': 'thumbnails1',
        'ServerIP': '127.0.0.11',
        'ServerName': 'default1'
        }
    }

var jsonValuesDefault = {
    'settings' : {
        'AMCPPort' : '5250',
        'LogPath': 'log',
        'MediaPath': 'media',
        'OSCPort': '6250',
        'TemplatePath': 'templates',
        'ThumbnailsPath': 'thumbnails',
        'ServerIP': '127.0.0.1',
        'ServerName': 'default'
        }
    }

function resetCasparConfig(){
    try {
        if(fs.existsSync(pathConfig)){
            fs.unlinkSync(pathConfig);
        };
        fs.writeFileSync(pathConfig, fs.readFileSync(appRoot + '/spec/caspar_config.master', 'utf-8'), 'utf-8');
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

function testArray(valuesArray, jsonArrayValues){
    jsonArraySettings = jsonArrayValues['settings'];
    if(valuesArray['amcpPort']!==jsonArraySettings['AMCPPort']){
        return new String("amcpPort value is " + valuesArray['amcpPort'] + " should be " + jsonArraySettings['AMCPPort']);
    }
    if(valuesArray['logPath']!==jsonArraySettings['LogPath']){
        return new String("logPath value is " + valuesArray['logPath'] + " should be " + jsonArraySettings['LogPath']);
    }
    if(valuesArray['mediaPath']!==jsonArraySettings['MediaPath']){
        return new String("mediaPath value is " + valuesArray['mediaPath'] + " should be " + jsonArraySettings['MediaPath']);
    }
    if(valuesArray['templatePath']!==jsonArraySettings['TemplatePath']){
        return new String("templatePath value is " + valuesArray['templatePath'] + " should be " + jsonArraySettings['TemplatePath']);
    }
    if(valuesArray['thumbnailsPath']!==jsonArraySettings['ThumbnailsPath']){
        return new String("thumbnailsPath value is " + valuesArray['thumbnailsPath'] + " should be " + jsonArraySettings['ThumbnailsPath']);
    }
    if(valuesArray['name']!==jsonArraySettings['ServerName']){
        return new String("name value is " + valuesArray['name'] + " should be " + jsonArraySettings['ServerName']);
    }
    if(valuesArray['ipAddr']!==jsonArraySettings['ServerIP']){
        return new String("ipAddr value is " + valuesArray['ipAddr'] + " should be " + jsonArraySettings['ServerIP']);
    }
    if(valuesArray['oscDefaultPort']!==jsonArraySettings['OSCPort']){
        return new String("oscDefaultPort value is " + valuesArray['oscDefaultPort'] + " should be " + jsonArraySettings['OSCPort']);
    }
    return true;
}

resetCasparConfig();

describe('getXmlValue()', function (){
    it("The function should return an xml value of 6250", function(){
        resetCasparConfig();
        var value = new Helper(appRoot + '/spec/caspar.config', true).getXMLValue('default-port');
        expect(value).toBe('6250');
    })
});

describe('checkCustomSettingsNode()', function(){
    it("The function should return true as the custom settings node is set during new Helper()", function(){
        var value = new Helper(appRoot + '/spec/caspar.config', true).checkCustomSettingsNode();
        expect(value).toBeTruthy();
    })
});

describe('getSettingsArray()', function(){
    it("The function should return an array of values", function() {
        resetCasparConfig();
        var valuesArray = new Helper(appRoot + '/spec/caspar.config', true).getSettingsArray();
        var value = testArray(valuesArray, jsonValuesDefault);
        expect(value).toBe(true, value);
    })
})

describe('setXmlValues()', function(){
    it("The function should return true, and the caspar.config file should be modified", function(){
        resetCasparConfig();
        var helper = new Helper(appRoot + '/spec/caspar.config', true);
        helper.setXmlValues(jsonValues);
        value = testArray(helper.getSettingsArray(), jsonValues);
        resetCasparConfig();
        expect(value).toBeTruthy();
    })
});