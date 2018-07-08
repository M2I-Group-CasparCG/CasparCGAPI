
const CasparCommon         = require('../Caspar/CasparCommon.js')

const appRoot = require('app-root-path');
var pathConfig = appRoot + '/spec/caspar.config';

describe('CasparCommon Tests', function (){

    describe('tcpSend()', function (){
        it('Shoul...', function(){
            let casparCommon = new CasparCommon(new Array());
            function callback (returnMessage){
                expect(returnMessage.command).toBe('command');
            }
            casparCommon.tcpSend('command', callback)
        });
    }); 

    describe('tcpPromise()', function (){
            it('Shoul return the sended command', function(){
                let casparCommon = new CasparCommon(new Array());
                let returnMessage = null
                    casparCommon.tcpPromise('command')
                        .then(
                            function(res){
                                expect(res.command).toBe('command');
                            },
                            function(rej){
                                expect(rej.command).toBe('command');
                            }
                        )
            });
    });

    describe('edit()', function (){
        it("Should return an object with the edited setting", function(){
            let casparCommon = new CasparCommon(new Array());
            let edit = null;


            edit = casparCommon.edit('name', 'editedName');
            expect(Object.keys(edit)[0]).toBe('name');
            expect(Object.values(edit)[0]).toBe('editedName');

            edit = casparCommon.edit('ipAddr', '1.1.1.1');
            expect(Object.keys(edit)[0]).toBe('ipAddr');
            expect(Object.values(edit)[0]).toBe('1.1.1.1');

            edit = casparCommon.edit('oscDefaultPort', 1);
            expect(Object.keys(edit)[0]).toBe('oscDefaultPort');
            expect(Object.values(edit)[0]).toBe(1);

            let oscPredefinedClient = new Object();
                oscPredefinedClient.address = '1.1.1.1';
                oscPredefinedClient.port = 1;
            edit = casparCommon.edit('oscPredefinedClient', oscPredefinedClient);
            expect(Object.keys(edit)[0]).toBe('oscPredefinedClient');
            expect(Object.values(edit)[0].address).toBe('1.1.1.1');
            expect(Object.values(edit)[0].port).toBe(1);

            edit = casparCommon.edit('logLevel', 1);
            expect(Object.keys(edit)[0]).toBe('logLevel');
            expect(Object.values(edit)[0]).toBe(1);

            edit = casparCommon.edit('logPath', 'editedLogPath');
            expect(Object.keys(edit)[0]).toBe('logPath');
            expect(Object.values(edit)[0]).toBe('editedLogPath');

            edit = casparCommon.edit('mediaPath', 'editedMediaPath');
            expect(Object.keys(edit)[0]).toBe('mediaPath');
            expect(Object.values(edit)[0]).toBe('editedMediaPath');

            edit = casparCommon.edit('templatePath', 'editedTemplatePath');
            expect(Object.keys(edit)[0]).toBe('templatePath');
            expect(Object.values(edit)[0]).toBe('editedTemplatePath');

            edit = casparCommon.edit('thumbnailsPath', 'editedThumbnailsPath');
            expect(Object.keys(edit)[0]).toBe('thumbnailsPath');
            expect(Object.values(edit)[0]).toBe('editedThumbnailsPath');

            edit = casparCommon.edit('unknown', 'bli');
            expect(Object.keys(edit)[0]).toBe('unknown');
            expect(Object.values(edit)[0]).toBe('not found');

        })
    });
});