class HyperdeckClip {

    constructor(settings){
        HyperdeckClip.totalInstances = (HyperdeckClip.totalInstances || 0) + 1;
        this.id             = settings['id'] || null;

    }

    

}

module.exports = HyperdeckClip;