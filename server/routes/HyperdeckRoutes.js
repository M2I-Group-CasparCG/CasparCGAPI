const ApiReturn =         require('./ApiReturn.js');

const Hyperdeck         = require('../../Hyperdeck/Hyperdeck.js')
const Clip              = require('../../Hyperdeck/HyperdeckClip.js')
const Slot              = require('../../Hyperdeck/HyperdeckSlot.js').default
const Timeline          = require('../../Hyperdeck/HyperdeckTimeline.js')

let hyperdecks = new Map();

require('events').EventEmitter.prototype._maxListeners = 100;

module.exports = function(socket){

    var hyperdeckRoutes = {};
    var apiReturn = new ApiReturn();

    /**
     * Clean object from circular references
     */
    hyperdeckRoutes.cleanObject  = function(object){
        const objectCopy = Object.assign({}, object);
            delete objectCopy.loop;
        const commonCopy = Object.assign({}, objectCopy.common);
            delete commonCopy.socketIo;
            delete commonCopy.socket;
            objectCopy.common = commonCopy;
        return objectCopy;
    }

    /**
     * Create a new instance of Hyperdeck
     * @param {*} req 
     * @param {*} res 
     */
    hyperdeckRoutes.add = async function(req, res){
        
        let hyperdeckSettings = req.body;
        let ipAddrFound = false;
        
        hyperdecks.forEach(hyperdeck => {
            if (hyperdeck.ipAddr == hyperdeckSettings.ipAddr ){
                ipAddrFound = true;
            }
        });
        if (ipAddrFound){
            msg = `hyperdeck with ${hyperdeckSettings.ipAddr} already exists`;
            res.json(apiReturn.clientErrorMessage(msg));
        }else{
            hyperdeckSettings.socketIo = socket;
            let hyperdeck = new Hyperdeck(hyperdeckSettings);
            hyperdecks.set(hyperdeck.getId(),hyperdeck);
            setTimeout(
                async function(){
                    res.json(hyperdeckRoutes.cleanObject(hyperdeck));
                    socket.emit('hyperdeckAdd',JSON.stringify(hyperdeckRoutes.cleanObject(hyperdeck)));
                },2000
            )
        }
    }

    /**
     * Get all the hyperdeck instances
     * @param {*} req 
     * @param {*} res 
     */
    hyperdeckRoutes.getAll = function (req, res){
        let array = [...hyperdecks];
        for(let n in array){
            array[n][1] = hyperdeckRoutes.cleanObject(array[n][1]);
        }
        res.json(array);
    }

    /**
     * Check the validity of an hyperdeck id
     */
    hyperdeckRoutes.check = function(req, res, next){
        const hyperdeckId = req.params.hyperdeckId;
        let hyperdeck = hyperdecks.get(parseInt(hyperdeckId));
        if(hyperdeck instanceof Hyperdeck){
            next();
        }else{
            res.json(apiReturn.notFoundMessage('hyperdeck instance not found'));
        }
    }

    /**
     * Get all hyperdeck sub instances of a specific object
     * @param {*} req 
     * @param {*} res 
     */
    hyperdeckRoutes.getAllObjects = function (req, res){
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        const objectType = req.params.objectType;
        let array = [];
        switch (objectType){
            case 'slots' : {
                array = [...hyperdeck.getSlots()];
            }break;
            case 'clips' : {
                array = [...hyperdeck.getClips()];
            }break;
        }
        res.json(array);
    }

    hyperdeckRoutes.scanDisks = async function (req, res) {
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        hyperdeck.scanDisks()
            .then(resolve => {
                res.json(apiReturn.successMessage('scanDisks success'));
            }, reject =>{ 
                res.json(apiReturn.errorMessage('scanDisks error'));
            }).catch( error => {
                res.json(apiReturn.errorMessage('scanDisks exception'));
            });
    }

    hyperdeckRoutes.getInfos = async function (req, res) {
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        hyperdeck.getInfos()
            .then(resolve => {
                res.json(hyperdeckRoutes.cleanObject(hyperdeck));
            }, reject =>{ 
                res.json(apiReturn.errorMessage('getInfos error'));
            }).catch( error => {
                res.json(apiReturn.errorMessage('getInfos exception'));
            });
    }

    hyperdeckRoutes.control = async function (req, res){
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        const control = req.params.control;
        hyperdeck.control(control)
            .then(resolve => {
                res.json(apiReturn.successMessage(`${control} command sended`));
            }, reject => {
                res.json(apiReturn.successMessage(`error whilde sending ${control} command`));
            }).catch( error => {
                res.json(apiReturn.successMessage(`exception whilde sending ${control} command`));
            })
    }

    hyperdeckRoutes.delete = async function (req, res){
        const hyperdeckId = parseInt(req.params.hyperdeckId);
        const hyperdeck = hyperdecks.get(hyperdeckId);
        if (hyperdeck instanceof Hyperdeck){
            hyperdeck.closeSocket();
            hyperdeck.setLoop(false);
            setTimeout(
                function(){
                    hyperdecks.delete(hyperdeck.getId());
                },2000
            )
            res.json(apiReturn.successMessage('hyperdeck instance deleted'));
            socket.emit('hyperdeckDelete',JSON.stringify(hyperdeckRoutes.cleanObject(hyperdeck)));
        }else{
            res.json(apiReturn.notFoundMessage('hyperdeck instance not found'));
        }
    }

    return hyperdeckRoutes;
}
