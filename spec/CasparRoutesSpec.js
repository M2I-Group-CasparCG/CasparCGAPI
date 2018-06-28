const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';   

let casparRoutes = require('../server/routes/casparRoutes.js');
let server = require('../server/server.js')
let request = require('supertest');




describe('capsarRoutes', function(){

       

        beforeEach(() => {

        });
    
        afterEach(() => {

        });

        describe('add()', function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/')
                    .set('Content-Type', 'application/json')
                    .send({"name" : "test"})
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        expect(res.body.object).toBe('Caspar');
                        done();
                    })
            })
        });
    
        describe('get()',  function (){
            it("Should be succes", function(done){   
                request(server)
                    .get('/api/v1/caspars/1')
                    .set('Content-Type', 'application/json')
                    .send({"name" : "test"})
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    });            
            });
        });

        describe('getAll()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .get('/api/v1/caspars/')
                    .set('Content-Type', 'application/json')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('ini()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/ini')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('edit()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/edit')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('delete()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/delete')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('restart()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/restart')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('editObject()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/screen/edit')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('getObject()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .get('/api/v1/caspars/1/screen/1')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });
        
        describe('getAllObject()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .get('/api/v1/caspars/1/screen')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('consumerAdd()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/screen')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('consumerStart()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/consumers/1/start')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('consumerStop()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/consumers/1/stop')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('consumerDelete()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .put('/api/v1/caspars/1/consumers/1')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('producerAdd()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/file')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('producerStart()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/producers/1/start')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('producerStop()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/producers/1/stop')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('producerDelete()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .put('/api/v1/caspars/1/screen/1')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('channelSetInput()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/channel/1/producers/1')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('channelLayersGetAll()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .get('/api/v1/caspars/1/channel/1/layers')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('channelLayerAdd()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/layers')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('layerDelete()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .delete('/api/v1/caspars/1/layers/id')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('layerDelete()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .delete('/api/v1/caspars/1/layers/id')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });

        describe('layerSetInput()',  function (){
            it("Should be succes", function(done){
                request(server)
                    .post('/api/v1/caspars/1/layers/id/producers/1')
                    .end(function(err, res){
                        expect(res.statusCode).toBe(200);
                        done();
                    }); 
            });  
        });
        
}); 
  

