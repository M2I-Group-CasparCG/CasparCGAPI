"use strict";
const XML = require('xml');
const fs = require('fs');
const XMLParser = require('xml2js');
const XMLDOM = require('xmldom');
const appRoot = require('app-root-path');

class XMLHelper{
    constructor(XMLStringParam, isFileParam){
        this.XMLStringParam = XMLStringParam;
        this.isFile = isFileParam || false;
        if(this.isFile){
            if(!this.checkCustomSettingsNode()){
                this.createCustomSettingsNode();
            }
        }
    };
    
    getXMLValue(keyRef, callback){
        var document = this.openConfigFile();
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
            if(this.isFile){
                document = new XMLDOM.DOMParser().parseFromString(fs.readFileSync(this.XMLStringParam, 'utf-8'));
            } else {
                document = new XMLDOM.DOMParser().parseFromString(this.XMLStringParam);
            }
        } catch (err) {
            console.log(err);
        }
        return document;
    }

    /**
     * document passed to setters MUST be a parsed XML DOM
     */

    setMediaPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('media-path')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getMediaPathValue(){
        var pathsBlock = this.openConfigFile().getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('media-path')[0].textContent;
    }

    getDecklinkValue(){
        var pathsBlock = this.openConfigFile().getElementsByTagName('system')[0];
        return pathsBlock.getElementsByTagName('decklink')[0].textContent;
    }

    setLogPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('log-path')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getLogPathValue(){
        var pathsBlock = this.openConfigFile().getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('log-path')[0].textContent;
    }

    setTemplatePathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('template-path')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getTemplatePathValue(){
        var pathsBlock = this.openConfigFile().getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('template-path')[0].textContent;
    }

    setThumbnailsPathValue(document, value){
        var pathsBlock = document.getElementsByTagName('paths')[0];
        pathsBlock.getElementsByTagName('thumbnails-path')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getThumbnailsPathValue(){
        var pathsBlock = this.openConfigFile().getElementsByTagName('paths')[0];
        return pathsBlock.getElementsByTagName('thumbnails-path')[0].textContent;
    }

    setAMCPPortValue(document, value){
        var tcpBlock = document.getElementsByTagName('tcp')[0];
        tcpBlock.getElementsByTagName('port')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getACMPPortValue(){
        var tcpBlock = this.openConfigFile().getElementsByTagName('tcp')[0];
        return tcpBlock.getElementsByTagName('port')[0].textContent;
    }

    setOSCPortValue(document, value){
        var oscPort = document.getElementsByTagName('osc')[0];
        oscPort.getElementsByTagName('default-port')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }
    
    getOSCPortValue(){
        var oscPort = this.openConfigFile().getElementsByTagName('osc')[0];
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
            fs.appendFileSync(this.XMLStringParam, customNode, 'utf-8');
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
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }

    getServerIPValue(){
        var customSettingsBlock = this.openConfigFile().getElementsByTagName('ClydeSettings')[0];
        return customSettingsBlock.getElementsByTagName('server-ip')[0].textContent;
    }

    setServerNameValue(document, value){
        var customSettingsBlock = document.getElementsByTagName('ClydeSettings')[0];
        customSettingsBlock.getElementsByTagName('server-name')[0].textContent = value;
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return document;
    }

    getServerNameValue(){
        var customSettingsBlock = this.openConfigFile().getElementsByTagName('ClydeSettings')[0];
        return customSettingsBlock.getElementsByTagName('server-name')[0].textContent;
    }

    getSettingsArray(){
        var returnArray = new Array();
        returnArray['name'] = this.getServerNameValue();
        returnArray['ipAddr'] = this.getServerIPValue();
        returnArray['amcpPort'] = this.getACMPPortValue();
        returnArray['oscDefaultPort'] = this.getOSCPortValue();
        returnArray['mediaPath'] = this.getMediaPathValue();
        returnArray['logPath'] = this.getLogPathValue();
        returnArray['templatePath'] = this.getTemplatePathValue();
        returnArray['thumbnailsPath'] = this.getThumbnailsPathValue();
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
        if(this.isFile){
            this.writeChangesToFile(document);
        }
        return true;
    }

    writeChangesToFile(document){
        fs.writeFileSync(this.XMLStringParam, new XMLDOM.XMLSerializer().serializeToString(document));
    }

    // getChannelNodeById(id){
    //     var document = this.openConfigFile();
    //     var channelsNode = document.getElementsByTagName('channels');
    //     return channelsNode[0].childNodes[id];
    // }

    // removeChannelNodeById(id){
    //     var channelNode = this.getChannelNodeById(2*id-1);
    //     var document = this.openConfigFile();
    //     // document.getElementsByTagName('channels')[0].childNodes[2*id-1].removeChild();
    //     // document.getElementsByTagName('channels')[0].childNodes[2*id-1].removeChild();
    //     // console.log(id + new XMLDOM.XMLSerializer().serializeToString(channelNode))
    //     document.getElementsByTagName('channels')[0].removeChild(channelNode)
    //     // var string = new XMLDOM.XMLSerializer().serializeToString();
    //     var string = new XMLDOM.XMLSerializer().serializeToString(document.getElementsByTagName('channels')[0])
    //     console.log(string)
    //     this.writeChangesToFile(document);
    // }

    // addNewChannelNode(id){

    // }
}
module.exports = XMLHelper;