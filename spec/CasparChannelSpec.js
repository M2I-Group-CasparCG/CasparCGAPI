const Channel       = require('../Caspar/CasparChannel.js');
const Producer      = require('../Caspar/Producers/CasparProducer.js');
const Layer         = require('../Caspar/CasparLayer.js')

const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config'


//describe('setInput()', function (){

//});

// describe('start()', function (){
   
// });

// describe('stop()', function (){
   
// });

// describe('mixerFill()', function (){
//         it('Shoul...', function(){

//         });
// });

// describe('CasparChannel Tests', function (){

// describe('addLayer()', function (){
//     it("Should return a layer instance", function(){
//         let channel = new Channel(new Array());
//         let layer = new Layer(new Array());
//         let value = channel.addLayer(layer);
//         expect(value).toBe(layer);
//     })
// });

// // describe('removeLayer()', function(){
    
// // });

// describe('getLayer()', function (){
//     it("Should return a layer instance", function(){
//         let channel = new Channel(new Array());
//         let layer = new Layer(new Array());
//         let value = channel.addLayer(layer);
//         expect(channel.getLayer(layer.id)).toBe(layer);
//     })
// });

// // describe('startLayer()', function(){
    
// // });

// // describe('stopLayer()', function(){
    
// // });

// describe('edit()', function (){
//     it("Should return an object with th edited setting", function(){
//         let channel = new Channel(new Array());
//         let edit = new Array();
//             let edit1 = channel.edit('name', 'editedName');
//             let edit2 = channel.edit('videoMode', 'editedVideoMode');
//             let edit3 = channel.edit('unknown', 'bli');

//         expect(Object.keys(edit1)[0]).toBe('name');
//         expect(Object.values(edit1)[0]).toBe('editedName');

//         expect(Object.keys(edit2)[0]).toBe('videoMode');
//         expect(Object.values(edit2)[0]).toBe('editedVideoMode');

//         expect(Object.keys(edit3)[0]).toBe('unknown');
//         expect(Object.values(edit3)[0]).toBe('not found');

//     })
// });


// describe('getid()', function(){
//     it('should return an integer', function(){
//         let channel = new Channel(new Array());
//         let value = channel.getId();
//         expect(typeof value).toBe('number');
//     })
// });


// });