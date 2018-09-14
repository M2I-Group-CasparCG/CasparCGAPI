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
    }

}

module.exports = HyperdeckSlot;