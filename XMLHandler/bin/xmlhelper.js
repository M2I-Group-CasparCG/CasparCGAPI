"use strict";
const XML = require('xml');
const fs = require('fs');
const XMLParser = require('xml2js');
const XMLDOM = require('xmldom');
const appRoot = require('app-root-path');

class XMLHelper{
    constructor(XMLFilePath){
        this.XMLFilePath = XMLFilePath;
        if(!this.checkCustomSettingsNode()){
            this.createCustomSettingsNode();
        }
    };
    
    getXMLValue(keyRef, callback){
        var document = new XMLDOM.DOMParser().parseFromString(fs.readFileSync(this.XMLFilePath, 'utf-8'));
        var returnValue = null;
        try {
            returnValue = document.getElementsByTagName(keyRef)[0].childNodes[0].nodeValue;
        } catch (error) {
            console.log(error);
        }
        return returnValue;
    }

    openConfigFile(){
        var document = null;
        try {
            document = new XMLDOM.DOMParser().parseFromString(fs.readFileSync(this.XMLFilePath, 'utf-8'));
        } catch (err) {
            console.log(err);
        }
        return document;
    }

    setMediaPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('media-path')[0].textContent = value;
        return document;
    }
    
    getMediaPathValue(document){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('media-path')[0].textContent;
    }

    setLogPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('log-path')[0].textContent = value;
        return document;
    }
    
    getLogPathValue(document){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('log-path')[0].textContent;
    }

    setTemplatePathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('template-path')[0].textContent = value;
        return document;
    }
    
    getTemplatePathValue(document){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('template-path')[0].textContent;
    }

    setThumbnailsPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('thumbnails-path')[0].textContent = value;
        return document;
    }
    
    getThumbnailsPathValue(document){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('thumbnails-path')[0].textContent;
    }

    setAMCPPortValue(document, value){
        var tcpBlock = document.getElementsByTagName('tcp')[0];
        tcpBlock.getElementsByTagName('port')[0].textContent = value;
        return document;
    }
    
    getACMPPortValue(document){
        var tcpBlock = document.getElementsByTagName('tcp')[0];
        return tcpBlock.getElementsByTagName('port')[0].textContent;
    }

    setOSCPortValue(document, value){
        var oscPort = document.getElementsByTagName('osc')[0];
        oscPort.getElementsByTagName('default-port')[0].textContent = value;
        return document;
    }
    
    getOSCPortValue(document){
        var oscPort = document.getElementsByTagName('osc')[0];
        return oscPort.getElementsByTagName('default-port')[0].textContent;
    }

    // setLogLevelValue(document, value){
    //     var oscPort = document.getElementsByTagName('osc')[0];
    //     pathsBlock.getElementsByTagName('default-port')[0].textContent = value;
    //     return document;
    // }
    
    // getLogLevelValue(document){
    //     var pathsBlock = document.getElementsByTagName('osc')[0];
    //     return pathsBlock.getElementsByTagName('default-port')[0].textContent;
    // }

    createCustomSettingsNode(){
        var customNode = XML({ClydeSettings : [{'server-name' : 'default'}, {'server-ip' : '127.0.0.1'}]});
        try {
            fs.appendFileSync(this.XMLFilePath, customNode, 'utf-8');
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }

    checkCustomSettingsNode(){
        var document = this.openConfigFile();
        var customNode = document.getElementsByTagName('ClydeSettings')[0];
        if(typeof customNode === 'undefined' || customNode.childNodes.length !== 2){
            return false;
        }
        return true;
    }

    setServerIPValue(document, value){
        var customSettingsBlock = document.getElementsByTagName('ClydeSettings')[0];
        customSettingsBlock.getElementsByTagName('server-ip')[0].textContent = value;
        return document;
    }

    getServerIPValue(document){
        var customSettingsBlock = document.getElementsByTagName('ClydeSettings')[0];
        return customSettingsBlock.getElementsByTagName('server-ip')[0].textContent;
    }

    setServerNameValue(document, value){
        var customSettingsBlock = document.getElementsByTagName('ClydeSettings')[0];
        customSettingsBlock.getElementsByTagName('server-name')[0].textContent = value;
        return document;
    }

    getServerNameValue(document){
        var customSettingsBlock = document.getElementsByTagName('ClydeSettings')[0];
        return customSettingsBlock.getElementsByTagName('server-name')[0].textContent;
    }

    getSettingsArray(){
        var returnArray = new Array();
        var document = this.openConfigFile();
        returnArray['name'] = this.getServerNameValue(document);
        returnArray['ipAddr'] = this.getServerIPValue(document);
        returnArray['amcpPort'] = this.getACMPPortValue(document);
        returnArray['oscDefaultPort'] = this.getOSCPortValue(document);
        returnArray['mediaPath'] = this.getMediaPathValue(document);
        returnArray['logPath'] = this.getLogPathValue(document);
        returnArray['templatePath'] = this.getTemplatePathValue(document);
        returnArray['thumbnailsPath'] = this.getThumbnailsPathValue(document);
        return returnArray;
    }

    setXmlValues(jsonValues){
        var document = this.openConfigFile();
        var jsonSettings = jsonValues['settings'];
        document = this.setAMCPPortValue(document, jsonSettings['ACMPPort']);
        document = this.setLogPathValue(document, jsonSettings['LogPath']);
        document = this.setMediaPathValue(document, jsonSettings['MediaPath']);
        document = this.setOSCPortValue(document, jsonSettings['OSCPort']);
        document = this.setTemplatePathValue(document, jsonSettings['TemplatePath']);
        document = this.setThumbnailsPathValue(document, jsonSettings['ThumbnailsPath']);
        document = this.setServerIPValue(document, jsonSettings['ServerIP']);
        document = this.setServerNameValue(document, jsonSettings['ServerName']);
        fs.writeFile(this.jsonValues, new XMLDOM.XMLSerializer().serializeToString(document), (err) => {
            if(err){
                console.log(err);
            }
        })

    }
}
module.exports = XMLHelper;

// var helper = new XMLHelper(appRoot + '/utilities/API/caspar.config');
// var jsonValues = {
//     'settings' : {
//         'ACMPPort' : '6666',
//         'LogPath': 'Log',
//         'MediaPath': 'Media',
//         'OSCPort': 'Test',
//         'TemplatePath': 'Template',
//         'ThumbnailsPath': 'Thumbnails',
//         'ServerIP': '128.1.1.1',
//         'ServerName': 'test'
//     }
// }
// console.log(helper.getXMLValue('default-port'));