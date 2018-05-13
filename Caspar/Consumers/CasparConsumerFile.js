"use strict";
var CasparConsumer = require('./CasparConsumer.js');

class CasparConsumerFILE extends CasparConsumer {

    constructor(settings){
        CasparConsumer.totalInstances = (CasparConsumer.totalInstances || 0) + 1;
        super(settings);
        console.log(CasparConsumer.totalInstances);
        this.id = CasparConsumer.totalInstances;
        this.type = 'FILE'
        this.fileName = settings['fileName'] || 'defaultVideoFile.mp4';
        this.filePath = settings['filePath'] || '';

        /**
         * -f // container format
            -vcodec // vicdeo codec
            -pix_fmt // pixel_format
            -r // video framerate
            -s // size
            -b // video bitrate
            -acodec // audio codec
            -ar // audio samplerate
            -ab // audio bitrate
            -ac // audio channels

            ADD 1 FILE myfile.mov -vcodec dnxhd
            ADD 1 FILE myfile.mov -vcodec prores
            ADD 1 FILE myfile.mov -vcodec dvvideo
            ADD 1 FILE myfile.mov -vcodec libx264

            Same settings as ConsumerStream

         */
    }

    run() {
        var req = `ADD ${this.channelId} ${this.type} ${this.filePath}${this.fileName}`;
        return this.tcpPromise(req);
    }

    stop() {
        var req = `REMOVE ${this.channelId} ${this.type}  ${this.filePath}${this.fileName}`;
        return this.tcpPromise(req);
    }

    edit (setting, value) {
        let response = new Object();
        switch (setting){
            case 'name' : {
                this.setName(value);
                response[setting] = this.getName();
            }
            break;
            case 'channelId' : {
                this.setChannelId(value);
                response[setting] = this.getChannelId();
            }
            break;
            case 'fileName' : {
                this.setFileName(value);
                response[setting] = this.getFileName();
            }
            break;
            case 'filePath' : {
                this.setFilePath(value);
                response[setting] = this.getFilePath();
            }
            break;
            default : {
                response[setting] = "not found";
            }
        }
        return response;
    }

    getFileName(){return this.fileName;}
    setFileName(fileName){this.fileName = fileName;}

    getFilePath(){return this.filePath;}
    setFilePath(){this.filePath = this.filePath;}

}

module.exports = CasparConsumerFILE;