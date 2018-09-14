const ApiReturn =         require('./ApiReturn.js');

const Hyperdeck         = require('../../Hyperdeck/Hyperdeck.js')
const Clip              = require('../../Hyperdeck/HyperdeckClip.js')
const Slot              = require('../../Hyperdeck/HyperdeckSlot.js').default
const Timeline          = require('../../Hyperdeck/HyperdeckTimeline.js')

let hyperdecks = new Map();

module.exports = function(socket){

    var hyperdeckRoutes = {};
    var apiReturn = new ApiReturn();

    /**
     * Clean object from circular references
     */
    cleanObject  = function(object){
        const objectCopy = Object.assign({}, object);
        delete objectCopy.socket;
        return objectCopy;
    }

    /**
     * Create a new instance of Hyperdeck
     * @param {*} req 
     * @param {*} res 
     */
    hyperdeckRoutes.add = async function(req, res){
        let hyperdeckSettings = req.body;
            hyperdeckSettings.socketIo = socket;
        let hyperdeck = new Hyperdeck(hyperdeckSettings);
            hyperdecks.set(hyperdeck.getId(),hyperdeck);
            res.json(cleanObject(hyperdeck));
    }

    /**
     * Get all the hyperdeck instances
     * @param {*} req 
     * @param {*} res 
     */
    hyperdeckRoutes.getAll = function (req, res){
        let array = [...hyperdecks];
        for(let n in array){
            array[n][1] = cleanObject(array[n][1]);
        }
        res.json(array);
    }

    hyperdeckRoutes.getAllObjects = function (req, res){
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        const objectType = req.params.objectType;
        let array = [];
        switch (objectType){
            case 'slots' : {
                array = [...hyperdeck.getSlots()];
            }break;
        }
        res.json(array);
    }



    return hyperdeckRoutes;
}
