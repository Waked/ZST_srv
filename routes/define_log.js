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
  con.query('SHOW TABLES', function(err, result) {
    if (err) throw err;
    console.log(result);
    const tables = result[0];
    var existsTable = false;
    for (var table in tables) {
      if (tables[table] === hash)
        existsTable = true;
    }
    if (existsTable) {
      console.log('Table already exists.');
      returnstring = 'Log DB already exists.';
    } else {
      returnstring = 'Log DB created.';
      createTable();
    }
    res.send({returnstring, hash});
  });

  function createTable() {
    var querybody = '';
    for (name in columnnames) {
      querybody += columnnames[name] + ' VARCHAR(150) NOT NULL,\n';
    }
    querybody = querybody.substring(0, querybody.length-2);
    const query_create =
    `CREATE TABLE ${hash} (
     id INT unsigned NOT NULL AUTO_INCREMENT,
     PRIMARY KEY (id),
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
