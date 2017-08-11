const redis = require('redis');
const R_PORT = 6379;
const R_HOST = '127.0.0.1';
const R_PWD = 'quandashi#@!2016';
const R_OPTS = {auth_pass: R_PWD};
//let client = redis.createClient(R_PORT, R_HOST, R_OPTS);
let client = 123;

//client.on('ready', function(err){
//	console.log('ready');
//})

module.exports = client;
