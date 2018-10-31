"use strict";
const utils = require('../utils.js');

class CasparObject {

    constructor(){
        CasparObject.totalInstances = (CasparObject.totalInstances || 0) + 1;
        this.id =  CasparObject.totalInstances;
    }  

    getId () {
        return this.id;
    }

}

module.exports = CasparObject;