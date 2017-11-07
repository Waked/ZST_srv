var express = require('express');
var crypto = require('crypto');
var router = express.Router();

router.post('/', function(req, res, next) {
  // res.send('Got a POST request');
  console.log("Got data: ");
  console.log(req.body);

  const columnnames = req.body['columnnames[]'];
  var stringsum = '';
  for (name in columnnames) {
    stringsum += columnnames[name].toUpperCase();
  }
  const hash = crypto.createHash('md5').update(stringsum).digest('hex');
  console.log("Hashed " + stringsum + " into " + hash);

  var returnstring = '';

  // Use db connection made in app.js
  con.query('SHOW TABLES', function(err, results) {
    if (err) throw err;
    console.log(results);
    var existsTable = false;
    for (var i in results) {
      if (results[i]['Tables_in_logs'] === "log_" + hash)
        existsTable = true;
    }
    if (existsTable) {
      console.log('Table already exists.');
      returnstring = 'Already exists.';
    } else {
      returnstring = 'Created.';
      createTable();
    }
    returnstring += ' md5=' + hash;
    res.send({returnstring, hash});
  });

  function createTable() {
    var querybody = '';
    for (name in columnnames) {
      querybody += columnnames[name] + ' VARCHAR(150) NOT NULL,\n';
    }
    querybody = querybody.substring(0, querybody.length-2);
    const query_create =
    `CREATE TABLE log_${hash} (
     id INT unsigned NOT NULL AUTO_INCREMENT,
     PRIMARY KEY (id),
     time VARCHAR(30),
     cid VARCHAR(100),
     ${querybody}
     )`;
     console.log(query_create);
    con.query(query_create, function(err, results) {
      if (err) throw err;
      console.log(results);
    });
  }
});

module.exports = router;
