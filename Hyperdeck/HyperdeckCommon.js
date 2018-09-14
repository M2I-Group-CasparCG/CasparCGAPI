const net       = require('net');

class HyperdeckCommon {

    constructor(settings){
        this.ipAddr     = settings['ipAddr'] || null;
        this.tcpPort    = settings['tcpPort'] || null;
        this.socket     = new net.Socket();
    }

   

}

module.exports = HyperdeckCommon;