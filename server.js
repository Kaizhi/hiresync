/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/demo', function(req, res){
	res.sendfile('app/demo.html');
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Set up socket.io
var io = require('socket.io').listen(server);
// Handle socket traffic
io.sockets.on('connection', function (socket) {
    // Relay chat data to all clients
	socket.on('editorUpdate', function(data) {
		socket.broadcast.emit('editorUpdate', data);
	});
});
