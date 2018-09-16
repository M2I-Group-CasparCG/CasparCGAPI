let attributes = `
this.id             = HyperdeckClip.totalInstances;
this.clipId         = settings['clipId'] || null;
this.clipName       = settings['clipName'] || null;
this.label          = settings['label'] || this.clipName;
this.videoCodec     = settings['videoCodec'] || null;
this.videoFormat    = settings['videoFormat'] || null;
this.duration       = settings['duration'] || null;
`

attributes = attributes.split('\n');

let result = `
    /**
     * GETTERS / SETTERS
     */
`

attributes.forEach(attribute => {
    attribute = attribute.split('=')[0].replace(/ /g,'').replace('this.','').replace('\r','');
    if (attribute.length > 0){
        Attribute = attribute[0].toUpperCase()+attribute.substr(1);
        
        result +=
`
    get${Attribute} () { return this.${attribute}; }
    set${Attribute} ( ${attribute} ) { this.${attribute} = ${attribute}; }
`

    }
});

console.log(result);