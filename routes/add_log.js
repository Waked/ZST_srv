var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  //res.render('index', { title: 'ZST Logger' });
  console.log('[add_log] received:');
  console.log(req.body);

  const columnnames = req.body['columnnames[]'];
  const values = req.body['values[]'];
  const hash = req.body['hash'];

  returnstring = 'Received ' + values;
  res.send({returnstring});

  var query = 'INSERT INTO ' + hash + ' (';
  for (name in columnnames) {
    query += columnnames[name] + ', ';
  }
  query = query.substring(0, query.length-2); // Snippet that removes last 2 chars
  query += ') VALUES \n( ';
  for (val in values) {
    query += `"${values[val]}", `;
  }
  query = query.substring(0, query.length-2) ; // Snippet that removes last 2 chars
  query += ')';
  console.log(query);

  con.query(query, function(err, results) {
    if (err) throw err;
    console.log("Successfully inserted into table!");
  })
});

module.exports = router;
