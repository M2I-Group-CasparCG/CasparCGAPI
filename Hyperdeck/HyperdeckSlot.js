const Clip      = require('./HyperdeckClip.js');

class HyperdeckSlot {

    constructor(settings){

        HyperdeckSlot.totalInstances = (HyperdeckSlot.totalInstances || 0) + 1;
        this.id             = HyperdeckSlot.totalInstances;
        this.status         = settings['status'] || null;
        this.volumeName     = settings['volumeName'] || null;
        this.recordingTime  = settings['recordingTime'] || null;
        this.videoFormat    = settings['videoFormat'] || null;
        this.isActive       = settings['isActive'] || false;
        this.slotId         = settings['slotId'] || false;

        this.clips          = new Map();
    }

    addClip (clip){
        if (clip instanceof(Clip)){
            this.clips.set(clip.id, clip);
        }
    }

    edit(settings){
        for (let [attribute, value] of Object.entries(settings)) {
            switch (attribute) {
                case 'slotId' : {
                    this.setSlotId(value);
                }break;
                case 'status' : {
                    this.setStatus(value);
                }break;
                case 'volumeName' :{   
                    this.setVolumeName(value);
                }break; 
                case 'recordingTime' : {
                    this.setRecordingTime(value);
                }break;
                case 'videoFormat' : {
                    this.setVideoFormat(value);
                }break;
            }
        }
    }

    /**
     * GETTERS / SETTERS
     */

    getId () { return this.id; }

    getStatus () { return this.staus; }
    setStatus (status) { this.status = status; }

    getVolumeName () { return this.volumeName; }
    setVolumeName (volumeName) { this.volumeName = volumeName; }

    getRecordingTime () { return this.recordingTime; }
    setRecordingTime (recordingTime) { this.recordingTime = recordingTime;}

    getVideoFormat () { return this.videoFormat; }
    setVideoFormat (videoFormat) { this.videoFormat = videoFormat; }

    getIsActive() { return this.isActive; }
    setIsActive(isActive) { this.isActive = isActive;}

    getSlotId() { return this.slotId; }
    setSlotId(slotId) { this.slotId = slotId; }

    getClips () { return this.clips; }
}

module.exports = HyperdeckSlot;