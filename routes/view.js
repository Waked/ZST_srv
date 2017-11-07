var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:tableid?/:deleteid?', function(req, res, next) {

  const tableid = req.params['tableid'];
  const deleteid = req.params['deleteid'];
  var table = null;

  if (deleteid) {
    con.query(`DELETE FROM ${tableid} WHERE id="${deleteid}"`, function(err, results) {
      if (err) throw err;
      console.log(results);
    });
  }

  if (tableid) {
    con.query('SELECT * FROM ' + tableid, function(err, results) {
      if (err) throw err;
      console.log(results);
      table = {results};
    });
  }

  var tablelist = [];

  con.query('SHOW TABLES', function(err, results) {
    if (err) throw err;
    //console.log(results);
    for (var row in results) {
      tablelist.push(results[row]['Tables_in_logs']);
    }
    res.render('view', { title: 'ZST Logger', tablelist, table, tableid });
  });

});

module.exports = router;
