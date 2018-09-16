const net       = require('net');
const Slot      = require('./HyperdeckSlot.js');
const Clip      = require('./HyperdeckClip.js');

class HyperdeckCommon {

    constructor(settings){

        this.ipAddr                 = settings['ipAddr'] || null;
        this.tcpPort                = settings['tcpPort'] || 9993;
        this.socket                 = new net.Socket();
        this.name                   = settings['name'] || `Hyperdeck ${Hyperdeck.totalInstances}`;
        this.socketIo               = settings['socketIo'];
        this.hyperdeckId            = settings['hyperdeckId'];

        // hyperdeck informations
        this.online                 = false;
        this.protocolVersion        = null;
        this.model                  = null;
        this.uid                    = null;
        this.audioInput             = null;
        this.videoInput             = null;
        this.fileFormat             = null;
        this.remoteEnabled          = null;
        this.remoteOverride         = null;
        this.status                 = null;
        this.speed                  = null;
        this.loop                   = null;
        this.displayTimeCode        = null;
        this.timeCode               = null;
        this.notifyRemote           = null;
        this.notifyTransport        = null;
        this.notifySlot             = null;
        this.notifyConfiguration    = null;

        this.activeSlot             = null;
        this.activeTimeline         = null;
        this.activeClipId           = null;
        this.activeClip             = null;

        this.timelines              = new Map();
        this.slots                  = new Map();
        this.clips                  = new Map();

        this.socketActive           = false;

        // custom settings
        this.recordName             = 'VeoRecord';
        this.previewEnable          = false;
        this.debugMode              = false;
    }

    /**
     * Initialize the tcp socket
     */
    async tcpSocketIni(){
        
        const hyperdeck = this; 
        
        this.socket.connect(this.tcpPort, this.ipAddr, function(){
            hyperdeck.debug(`\x1b[34m[INFO] \t\t\t Socket Initalized`);
            hyperdeck.setSocketActive(true);
        });

        this.socket.on('error', function(error){
            console.log('error : ')
            console.log(error);
            hyperdeck.setSocketActive(false);
        })

        this.socket.on('timeout', function(error){
            console.log('timeout : ')
            console.log(error);
            hyperdeck.setSocketActive(false);
        })

        this.socket.on('data', function(data){
            hyperdeck.hyperdeckDataParser(data);
        })

        this.socket.on('end', function(data){
            console.log('end');
            hyperdeck.setSocketActive(false);
        })

        this.socket.on('close', function(data){
            console.log('close');
            hyperdeck.setSocketActive(false);
        })  

        return true;
    }

    /**
     * Parse the hypederdeck response by separating the first line (messageType) and the datas as an array
     * Add the parsed properties to the corresponding instances
     * @param {String} data 
     */
    hyperdeckDataParser(data){
        const result = Object();
        let message = data.toString();
        message = message.split('\r\n');
        const clipPattern = /^\d{2}: [^ ]* [^ ]* [^ ]* \d*:\d{2}:\d{2}:\d{2}$/;

        const messageType = message.shift();
        let attribute = null;
        let value = null;
        this.debug(`\x1b[34m[INFO] [RECEIVED]\t ${messageType}`);
        const hyperdeck = this;
        switch (messageType){
            case '120 connection rejected' : {

            }break;
            case '500 connection info:' :
            case '204 device info:' : {
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch(attribute){
                            case 'protocol version' : {
                                hyperdeck.protocolVersion   = parseFloat(value);
                            }break;
                            case 'model' : {
                                hyperdeck.model             = value;
                            }break;
                            case 'unique id' : {
                                hyperdeck.uid               = value;
                            }break;
                        }
                    }
                });           
            }break;
            case '202 slot info:' :
            case '502 slot info:' : {
                let slotSettings = new Map();
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch (attribute){
                            case 'status' : {
                                slotSettings['status']          = value;
                            }break;
                            case 'slot id' : {
                                slotSettings['slotId']          = parseInt(value);
                            }break;
                            case 'volume name' : {
                                slotSettings['volumeName']      = value;
                            }break;
                            case 'recording time' : {
                                slotSettings['recordingTime']   = parseInt(value);
                            }break;
                            case 'video format' : {
                                slotSettings['videoFormat']     = value;
                            }break;
                        }                      
                    }
                })
                hyperdeck.getSlots().get(slotSettings.slotId).edit(slotSettings);
                // this.sendSocketIo('hyperdeckEdit',hyperdeck);
            }break;
            case '208 transport info:' :
            case '508 transport info:' : {
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch (attribute){
                            case 'status' :{
                                hyperdeck.status            = value;
                            }break;
                            case 'speed' : {
                                hyperdeck.speed             = parseInt(value);
                            }break;
                            case 'slot id' : {
                                hyperdeck.activeSlot        = parseInt(value);
                            }break;
                            case 'clip id' : {
                                hyperdeck.activeClipId        = parseInt(value);
                            }break;
                            case 'display timecode' : {
                                hyperdeck.displayTimeCode   = value;
                            }break;
                            case 'timecode' : {
                                hyperdeck.timeCode          = value;
                            }break; 
                            case 'video format' : {
                                hyperdeck.videoFormat       = value;
                            }break;
                            case 'loop' : {
                                hyperdeck.loop              = (value === 'true');
                            }break;
                        }
                    }
                });
                // this.sendSocketIo('hyperdeckEdit',hyperdeck);
            }break;
            case '210 remote info:' :
            case '510 remote info:' : {
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch (attribute){
                            case 'enabled' : {
                                hyperdeck.remoteEnabled     = (value === 'true');
                            }break;
                            case 'override' : {
                                hyperdeck.remoteOverride    = (value === 'true');
                            }break;
                        }
                    }
                });    
                // this.sendSocketIo('hyperdeckEdit',hyperdeck);           
            }break;
            case '206 disk  list:' : {
                /**
                 * WOP
                 */
                console.log(message);
                // hyperdeck.activeSlot = message.shift().split(': ')[1];
                for(let n=0; n< message.length; n++){
                    if (message[n].match(clipPattern)){
                        let clip = this.clipInfoParser(message[n]);
                        this.clips.set(clip.id, clip);
                    }
                }
            }break;
            case '205 clips info:' : {
                // console.log(messageType);
                // console.log(message);
                // message.forEach(line => {
                //     if (line.length > 0 ){
                //         console.log(line);
                //         const clip = this.clipInfoParser(line);
                //         if (clip.clipId == hyperdeck.getActiveClipId()){
                //             console.log(clip);
                //             hyperdeck.setActiveClip(clip);
                //         }
                //     }
                // });
                
            }break;
            case '211 configuration:' :
            case '511 configuration:' : {
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch (attribute) {
                            case 'audio input' : {
                                hyperdeck.audioInput        = value;
                            }break;
                            case 'video input' : {
                                hyperdeck.videoInput        = value;
                            }break;
                            case 'file format' : {
                                hyperdeck.fileFormat        = value;
                            }break;
                        }
                    }
                });  
                // this.sendSocketIo('hyperdeckEdit',hyperdeck);            
            }break;
            case '209 notify:' : {
                message.forEach(line => {
                    if (line.length > 0 ){
                        let attribute = line.split(': ')[0];
                        let value = line.split(': ')[1];
                        switch (attribute){
                            case 'transport' : {
                                hyperdeck.notifyTransport       = (value === 'true');
                            }break;
                            case 'slot' : {
                                hyperdeck.notifySlot            = (value === 'true');
                            }break;
                            case 'remote' : {
                                hyperdeck.notifyRemote          = (value === 'true');
                            }break;
                            case 'configuration' : {
                                hyperdeck.notifyConfiguration   = (value === 'true');
                            }break;
                        }
                    }
                });
                // this.sendSocketIo('hyperdeckEdit',hyperdeck);
            }break;
            case '200 ok:' : {

            }break;
            case '111 remote control disabled' : {

            }break;
            default : {
                if (messageType.match(clipPattern)){
                    let clip = this.clipInfoParser(messageType);
                    this.clips.set(clip.id, clip);
                    for(let n=0; n< message.length; n++){
                        if (message[n].match(clipPattern)){
                            let clip = this.clipInfoParser(message[n]);
                            this.clips.set(clip.id, clip);
                        }
                    }
                }
            }
        }
        
        this.sendSocketIo('hyperdeckEdit', hyperdeck); 
        
    }

    lineParser (message){
        let attribute = null;
        let line = null;
       

        return attribute, line;
    }
    
    /**
     * Parse one clip line from the hyperdeck
     * @param {String} message 
     * @return {Clip} clip  The newly created clip instance
     */
    clipInfoParser (message) {
        let clipSettings = new Map();
        clipSettings['clipId']      = message.split(': ')[0];
        message = message.split(': ')[1].split(' ');
        clipSettings['clipName']    = message[0];
        clipSettings['videoCodec']  = message[1];
        clipSettings['videoFormat'] = message[2];
        clipSettings['duration']    = message[3];

        let clip = new Clip(clipSettings);
        return clip;
    }

    /**
     * Send a tcp command to the hyperdeck
     * @param {String} message 
     * @return {Promise} 
     */
    async tcpSocketSend(message){
        const hyperdeck = this;
        
        return new Promise(async function(resolve,reject){
            if (hyperdeck.socketActive){
                await hyperdeck.socket.write(message+'\r\n', function(){
                    setTimeout(
                        function(){
                            resolve(`\x1b[35m[INFO] [SENDED] \t ${message}`);
                        },10
                    )
                });
            }else{
                reject('\x1b[31m[ERROR] Socket is not open');
            }
           
        });
    }

    sendSocketIo(key, object){
        const objectCopy = Object.assign({}, object);
        if ( objectCopy.common ){
            const commonCopy = Object.assign({}, objectCopy.common);
            delete commonCopy.socketIo;
            delete commonCopy.socket;
            objectCopy.common = commonCopy;
        }
        if (objectCopy.socketIo ){
            delete objectCopy.socketIo;
        }
        if (objectCopy.socket){
            delete objectCopy.socket;
        }
        
        const succes = this.socketIo.emit(key,JSON.stringify(objectCopy));
        if(! succes){
            console.log('error while sending socket.IO : '+key+' - '+object);
        }
    }

    /**
     * GETTERS / SETTERS
     */

    getTcpPort () { return this.tcpPort; }
    setTcpPort ( tcpPort ) { this.tcpPort = tcpPort; }

    getSocket () { return this.socket; }
    setSocket ( socket ) { this.socket = socket; }

    getName () { return this.name; }
    setName ( name ) { this.name = name; }

    getOnline () { return this.online; }
    setOnline ( online ) { this.online = online; }

    getProtocolVersion () { return this.protocolVersion; }
    setProtocolVersion ( protocolVersion ) { this.protocolVersion = protocolVersion; }

    getModel () { return this.model; }
    setModel ( model ) { this.model = model; }

    getUid () { return this.uid; }
    setUid ( uid ) { this.uid = uid; }

    getAudioInput () { return this.audioInput; }
    setAudioInput ( audioInput ) { this.audioInput = audioInput; }

    getVideoInput () { return this.videoInput; }
    setVideoInput ( videoInput ) { this.videoInput = videoInput; }

    getFileFormat () { return this.fileFormat; }
    setFileFormat ( fileFormat ) { this.fileFormat = fileFormat; }

    getRemoteEnabled () { return this.remoteEnabled; }
    setRemoteEnabled ( remoteEnabled ) { this.remoteEnabled = remoteEnabled; }
    toggleRemoteEnabled () { 
        this.remoteEnabled = !this.remoteEnabled;
        return this.remoteEnabled; }


    getRemoteOverride () { return this.remoteOverride; }
    setRemoteOverride ( remoteOverride ) { this.remoteOverride = remoteOverride; }

    getStatus () { return this.status; }
    setStatus ( status ) { this.status = status; }

    getSpeed () { return this.speed; }
    setSpeed ( speed ) { this.speed = speed; }

    getLoop () { return this.loop; }
    setLoop ( loop ) { this.loop = loop; }

    getDisplayTimeCode () { return this.displayTimeCode; }
    setDisplayTimeCode ( displayTimeCode ) { this.displayTimeCode = displayTimeCode; }

    getTimeCode () { return this.timeCode; }
    setTimeCode ( timeCode ) { this.timeCode = timeCode; }

    getNotifyRemote () { return this.notifyRemote; }
    setNotifyRemote ( notifyRemote ) { this.notifyRemote = notifyRemote; }

    getNotifyTransport () { return this.notifyTransport; }
    setNotifyTransport ( notifyTransport ) { this.notifyTransport = notifyTransport; }

    getNotifySlot () { return this.notifySlot; }
    setNotifySlot ( notifySlot ) { this.notifySlot = notifySlot; }

    getNotifyConfiguration () { return this.notifyConfiguration; }
    setNotifyConfiguration ( notifyConfiguration ) { this.notifyConfiguration = notifyConfiguration; }

    getActiveSlot () { return this.activeSlot; }
    setActiveSlot ( activeSlot ) { this.activeSlot = activeSlot; }

    getActiveTimeline () { return this.activeTimeline; }
    setActiveTimeline ( activeTimeline ) { this.activeTimeline = activeTimeline; }

    getActiveClipId () { return this.activeClipId; }
    setActiveClipId ( activeClipId ) { this.activeClipId = activeClipId; }

    setActiveClip(clip) { this.activeClip = clip;}
    getActiveClip () {return this.activeClip;}

    getTimelines () { return this.timelines; }
    setTimelines ( timelines ) { this.timelines = timelines; }

    getSlots () { return this.slots; }
    setSlots ( slots ) { this.slots = slots; }

    getClips () { return this.clips; }
    setClips ( clips ) { this.clips = clips; }

    getSocketActive () { return this.socketActive; }
    setSocketActive ( socketActive ) { this.socketActive = socketActive; }

    getRecordName () { 
        let date = new Date();
            date = date.toISOString().replace(/-/g,'').replace('T','_').replace(/:/g,'').replace('.','').replace('Z','');
            return `${date}_${this.recordName}`;
    }
    setRecordName ( name ) { this.recordName = name; }

    getPreviewEnable () { return this.previewEnable; }
    setPreviewEnable (boolean) { this.previewEnable = boolean; }
    togglePreviewEnable () { 
        this.previewEnable = !this.previewEnable;
        return this.previewEnable; }

    debug (message){
        if (this.debugMode){
            console.log(message);
        }
    }
}

module.exports = HyperdeckCommon;