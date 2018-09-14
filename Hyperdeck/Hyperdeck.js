const net       = require('net');
const Slot      = require('./HyperdeckSlot.js');

class Hyperdeck {

    constructor(settings){

        Hyperdeck.totalInstances    = (Hyperdeck.totalInstances || 0) + 1;
        this.id                     =  Hyperdeck.totalInstances;
        this.object                 = 'Hyperdeck';
        this.ipAddr                 = settings['ipAddr'] || '127.0.0.1';
        this.tcpPort                = settings['tcpPort'] || 9993;
        this.name                   = settings['name'] || `Hyperdeck ${Hyperdeck.totalInstances}`;
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

        this.slots                  = new Map();
        this.activeslot             = null;

        this.timelines              = new Map();
        this.currentTimelineId      = null;

        this.clips                  = new Map();
        this.clipId                 = null;

        this.commandQueue           = [];

        this.socket                 = new net.Socket();

        this.tcpSocketIni();
        this.getInfos();

       
    }

    tcpSocketIni(){

        // console.log(this.socket);
        const hyperdeck = this;
        this.socket.connect(this.tcpPort, this.ipAddr);

        this.socket.on('error', function(error){
            console.log('error : ')
            console.log(error);
        })

        this.socket.on('timeout', function(error){
            console.log('timeout : ')
            console.log(error);
        })

        this.socket.on('data', function(data){
            console.log('data :');
            hyperdeck.hyperdeckDataParser(data);
            if (hyperdeck.commandQueue.length > 0){
                this.socket.write(hyperdeck.commandQueue.shift());
            }
        })

        this.socket.on('close', function(data){
            console.log('close :');
            console.log(data.toString());
        })

    }

    hyperdeckDataParser(data){
        const result = Object();
        let message = data.toString();
            // message = message.replace('\r\n\r\n','');
        message = message.split('\r\n');
        const messageType = message.shift();
        console.log(messageType);
        const hyperdeck = this;

        switch (messageType){

            case '500 connection info:' : {
                hyperdeck.protocolVersion   = parseFloat(message[0].split(': ')[1]);
                hyperdeck.model             = message[1].split(': ')[1];
            }break;
            case '204 device info:' : {
                hyperdeck.protocolVersion   = parseFloat(message[0].split(': ')[1]);
                hyperdeck.model             = message[1].split(': ')[1];
                hyperdeck.uid               = message[2].split(': ')[1];
            }break;
            case '202 slot info:' : {
                let slotSettings = new Map();
                    slotSettings['slotId']          = parseInt(message[0].split(': ')[1]);
                    slotSettings['status']          = message[1].split(': ')[1];
                    slotSettings['volumeName']      = message[2].split(': ')[1];
                    slotSettings['recordingTime']   = parseInt(message[3].split(': ')[1]);
                    slotSettings['videoFormat']     = message[4].split(': ')[1];
                let slot = new Slot(slotSettings);
                hyperdeck.slots.set(slot.slotId, slot);
            }break;
            case '208 transport info:' : {
                hyperdeck.status            = message[0].split(': ')[1];
                hyperdeck.speed             = parseInt(message[1].split(': ')[1]);
                hyperdeck.activeslot        = parseInt(message[2].split(': ')[1]);
                hyperdeck.clipId            = parseInt(message[3].split(': ')[1]);
                hyperdeck.displayTimeCode   = message[4].split(': ')[1];
                hyperdeck.timeCode          = message[5].split(': ')[1];
                hyperdeck.videoFormat       = message[6].split(': ')[1];
                hyperdeck.loop              = (message[6].split(': ')[1] === 'true');
            }break;
            case '210 remote info:' : {
                console.log(message);
                hyperdeck.remoteEnabled     = (message[0].split(': ')[1] === 'true');
                hyperdeck.remoteOverride    = (message[1].split(': ')[1] === 'true');
            }break;
            case '206 disk  list:' : {
                console.log(message);
            }break;
            case '211 configuration:' : {
                console.log(message);
                hyperdeck.audioInput        = message[0].split(': ')[1];
                hyperdeck.videoInput        = message[1].split(': ')[1];
                hyperdeck.fileFormat        = message[2].split(': ')[1];
            }
        }
    }

    tcpSocketSend(message){
        if (this.commandQueue.length == 0){
            this.socket.write(message+'\r\n');
        }else{
            this.commandQueue.push(message)
        }
        
    }

    getInfos () {
        this.tcpSocketSend('remote');
        this.tcpSocketSend('device info');
        this.tcpSocketSend('slot info');
        this.tcpSocketSend('transport info');
        // this.tcpSocketSend('disk list');
        this.tcpSocketSend('configuration');
    }

    /**
     * GETTERS / SETTERS
     */
    getId () { return this.id; }
    getSlots () { return this.slots; }
}   

module.exports = Hyperdeck;