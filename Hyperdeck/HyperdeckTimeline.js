class HyperdeckTimeline {

    constructor(settings){
        HyperdeckTimeline.totalInstances = (HyperdeckTimeline.totalInstances || 0) + 1;
        this.id             = settings['id'] || null;

    }
}

module.exports = HyperdeckTimeline;