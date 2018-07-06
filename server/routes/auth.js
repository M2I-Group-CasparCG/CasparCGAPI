// Inclure les modules
var jwt = require('jwt-simple');
var sqlite3 = require('sqlite3').verbose();

var auth = {

  login: function(req, res) {

    // Recupere le username et le password depuis la page web
    // test
    var username = "zak" || '';
    var password = "12345" || '';

    // A decommenter quand ce sera prêt
    //var username = req.body.username || '';
    //var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    var dbUserObj = auth.validate(username, password);

    if (!dbUserObj) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    if (dbUserObj) {

      // If authentication is success, we will generate a token
      // and dispatch it to the client

      res.json(genToken(dbUserObj));
    }

  },

  validate: function(username, password) {

    // Verifie si le user existe
    var db = new sqlite3.Database('../middlewares/casparcg.db');
    db.all('select pseudo,password from compte where pseudo = ? and password = ?',[username,password],function(err,rows){
      rows.forEach(function(row){
        user = row.pseudo;
        pwd = row.password;
        if (user == username) {
          if (pwd == password) {
            console.log("Le user est bien connecte");
            var dbUserObj = {
              name: username
            }
          }
        }
        else {
          var dbUserObj = {
            name: username
          }
        }
        return dbUserObj;
      });
      // Ici le reste du code pour valider l'authentification ou non
    });
    db.close();

    // spoofing the DB response for simplicity
    //var dbUserObj = { // spoofing a userobject from the DB.
    //  name: username,
    //  role: 'admin',
    //  username: 'admin@clydeUI.com'
    //};

    //return dbUserObj;
  },

  validateUser: function(username) {
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB.
      name: 'admin',
      role: 'admin',
      username: 'admin@clydeUI.com'
    };


    return dbUserObj;
  },
}

// private method
function genToken(user) {
  var expires = expiresIn(7); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());

  return {
    token: token,
    expires: expires,
    user: user
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
