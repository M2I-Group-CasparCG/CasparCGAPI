var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var casparApi = express();
var sqlite3 = require('sqlite3').verbose();

    casparApi.use(logger('dev'));
    casparApi.use(bodyParser.json());
    casparApi.disable('etag');
    casparApi.all('/*', function(req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    // Auth Middleware - This will check if the token is valid
    // Only the requests that start with /api/v1/* will be checked for the token.
    // Any URL's that do not follow the below pattern should be avoided unless you
    // are sure that authentication is not needed

    // ligne à décommenter pour activer authentification par token
    // casparApi.all('/api/v1/*', [require('./middlewares/validateRequest')]);

    casparApi.use('/', require('./routes'));

    // If no route is matched by now, it must be a 404
    casparApi.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
        err.message = "no route";
        res.send(err);
    });

    // Start the server
    casparApi.set('port', process.env.PORT || 3000);

    var server = casparApi.listen(casparApi.get('port'), function() {
        console.log('Express server listening on port ' + server.address().port);
    });
