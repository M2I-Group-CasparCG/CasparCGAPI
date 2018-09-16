const net                   = require('net');
const Slot                  = require('./HyperdeckSlot.js');
const Clip                  = require('./HyperdeckClip.js');
const HyperdeckCommon       = require('./HyperdeckCommon.js');
class Hyperdeck {

    constructor(settings){

        Hyperdeck.totalInstances    = (Hyperdeck.totalInstances || 0) + 1;
        this.id                     =  Hyperdeck.totalInstances;
        this.object                 = 'Hyperdeck';
        settings['hyperdeckId']     = this.id;
        this.common                 = new HyperdeckCommon(settings);
        this.socketActiveRemind     = null;
        this.statusLoopInterval     = 40;
        let slot1 = new Slot({});
        let slot2 = new Slot({});
        this.getCommon().getSlots().set(1, slot1);
        this.getCommon().getSlots().set(2, slot2);

        this.statusLoop();
    }

    statusLoop () {
        const hyperdeck = this;
        setTimeout (
            function(){
                let succes;
                if (hyperdeck.getCommon().getSocketActive()){
                    if (this.socketActiveRemind){
                        this.getInfos();
                        this.socketActiveRemind = true;
                        this.statusLoopInterval = 40;
                    }
                   
                    hyperdeck.getCommon().tcpSocketSend('transport info')
                    .then(resolve => {
                        this.socketActiveRemind = true;
                    }, reject =>{
                        hyperdeck.getCommon().setSocketActive(false);
                    }).catch(reject =>{
                        hyperdeck.getCommon().setSocketActive(false);
                        hyperdeck.getCommon().sendSocketIo('hyperdeckEdit', hyperdeck.getCommon());
                    })
                }else{
                    this.statusLoopInterval = 1000
                    this.socketActiveRemind = false;
                    hyperdeck.getCommon().tcpSocketIni();
                }
                hyperdeck.statusLoop();
            }, this.statusLoopInterval
        );
    }

    /**
     * Collecting the variables on the hyperdeck
     * @return : boolean (true) when finished
     */
    async getInfos () {

        if (this.getCommon().getSocketActive()){
            await this.getCommon().tcpSocketSend('remote: enable: true')
            .then(resolve => {
                console.log(resolve);   
            }).catch(reject =>{
                console.log(reject);
            })
        await this.getCommon().tcpSocketSend('remote: override: true')
            .then(resolve => {
                console.log(resolve);   
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('remote')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('device info')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })
        await  this.getCommon().tcpSocketSend('slot info: slot id: 1')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })
        await  this.getCommon().tcpSocketSend('slot info: slot id: 2')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })
        await this.getCommon().tcpSocketSend('transport info')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })
        await this.getCommon().tcpSocketSend('clips get')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('configuration')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('notify: remote: true')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('notify: transport: true')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('notify: slot: true')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('notify: configuration: true')
            .then(resolve => {
                console.log(resolve);
            }).catch(reject =>{
                console.log(reject);
            })

        await this.getCommon().tcpSocketSend('notify')
            .then(resolve => {
                console.log(resolve);   
            }).catch(reject =>{
                console.log(reject);
            })
        }
        
        

        return true;
    }

    /**
     * Work in progress
     */
    async scanDisks(){

        await this.getCommon().tcpSocketSend('disk list: slot id: 1')
            .then(resolve => {
                // console.log('[RESPONSE] \r\n'+resolve.toString());
            }).catch(reject =>{

            })

        await this.getCommon().tcpSocketSend('disk list: slot id: 2')
            .then(resolve => {
                // console.log('[RESPONSE] \r\n'+resolve.toString());
            }).catch(reject =>{

            })
    }

    getSlots(){
        return this.getCommon().getSlots();
    }

    async control(controlType){
        const hyperdeck = this;
        return new Promise(async function(resolve,reject){
            switch (controlType){
                case 'play' : {
                    await hyperdeck.getCommon().tcpSocketSend('play')
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'stop' : {
                    await hyperdeck.getCommon().tcpSocketSend('stop')
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'next' : {
                    await hyperdeck.getCommon().tcpSocketSend('goto: clip id: +1')
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'previous' : {
                    await hyperdeck.getCommon().tcpSocketSend('goto: clip id: -1')
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'fastFw' : {
                    let speed = hyperdeck.getCommon().getSpeed();
                    if (speed <= 0 ){
                        hyperdeck.getCommon().setSpeed(200);
                    }else if (speed == 100){
                        hyperdeck.getCommon().setSpeed(200);
                    }
                    else if (speed < 1600){
                        hyperdeck.getCommon().setSpeed(speed*2);
                    }else{
                        hyperdeck.getCommon().setSpeed(100);
                    }
                    await hyperdeck.getCommon().tcpSocketSend(`play: speed: ${hyperdeck.getCommon().getSpeed()}`)
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'fastBw' : {
                    let speed = hyperdeck.getCommon().getSpeed();
                    if (speed >= 0 ){
                        hyperdeck.getCommon().setSpeed(-200);
                    }else if (speed == -100){
                        hyperdeck.getCommon().setSpeed(-200);
                    }
                    else if (speed > -1600){
                        hyperdeck.getCommon().setSpeed(speed*2);
                    }else{
                        hyperdeck.getCommon().setSpeed(100);
                    }
                    await hyperdeck.getCommon().tcpSocketSend(`play: speed: ${hyperdeck.getCommon().getSpeed()}`)
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'rec' : {
                    const recordName = hyperdeck.getCommon().getRecordName();
                    await hyperdeck.getCommon().tcpSocketSend(`record: name: ${recordName}`)
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'previewEnable' : {
                    await hyperdeck.getCommon().tcpSocketSend(`preview: enable: ${hyperdeck.getCommon().togglePreviewEnable()}`)
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
                case 'remoteEnable' : {
                    await hyperdeck.getCommon().tcpSocketSend(`remote: enable: ${hyperdeck.getCommon().toggleRemoteEnabled()}`)
                        .then(_resolve => {
                            console.log(_resolve);
                            resolve(true);
                        }).catch(_reject =>{
                            console.log(_reject);
                            reject(false);
                        })
                }break;
            }
        });
        
    }

    async closeSocket () {

        this.getCommon().getSocket().destroy();
    }

    /**
     * GETTERS / SETTERS
     */
    getId () { return this.id; }
    getCommon () { return this.common; }
}   

module.exports = Hyperdeck;