var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mukeke111',
  database : 'm_test'
});

connection.connect();

module.exports = connection;