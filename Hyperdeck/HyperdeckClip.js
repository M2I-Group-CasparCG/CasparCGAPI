class HyperdeckClip {

    constructor(settings){
        HyperdeckClip.totalInstances = (HyperdeckClip.totalInstances || 0) + 1;
        this.id             = HyperdeckClip.totalInstances;
        this.clipId         = settings['clipId'] || null;
        this.clipName       = settings['clipName'] || null;
        this.label          = settings['label'] || this.clipName;
        this.videoCodec     = settings['videoCodec'] || null;
        this.videoFormat    = settings['videoFormat'] || null;
        this.duration       = settings['duration'] || null;
    }

    /**
     * GETTERS / SETTERS
     */

    getId () { return this.id; }
    setId ( id ) { this.id = id; }

    getClipId () { return this.clipId; }
    setClipId ( clipId ) { this.clipId = clipId; }

    getClipName () { return this.clipName; }
    setClipName ( clipName ) { this.clipName = clipName; }

    getLabel () { return this.label; }
    setLabel ( label ) { this.label = label; }

    getVideoCodec () { return this.videoCodec; }
    setVideoCodec ( videoCodec ) { this.videoCodec = videoCodec; }

    getVideoFormat () { return this.videoFormat; }
    setVideoFormat ( videoFormat ) { this.videoFormat = videoFormat; }

    getDuration () { return this.duration; }
    setDuration ( duration ) { this.duration = duration; }

    

}

module.exports = HyperdeckClip;