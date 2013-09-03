/**
 * Module dependencies.
 */
'use strict';
var express = require('express'),
    http = require('http'),
    path = require('path'),
    io = require('socket.io'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    moment = require('moment'),
    helpers = require('./helpers');


var app = express();
// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser('your secret here'));
    app.use(express.session());

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'app')));
});

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// Configure passport
var Account = require('./models/account');

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
// Connect mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_examples');

// Setup routes
require('./routes')(app);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

//******************* SIO ********************************//

// Set up socket.io
var io = require('socket.io').listen(server);
// Handle socket traffic
var clients = [],
    numClients = 0;
io.sockets.on('connection', function (socket) {
    numClients++;
    clients.push({
        'name' : 'Guest' + numClients,
        'id' : socket.id
    });

    socket.on('disconnect', function () {
        numClients--;
        clients.splice(clients.indexOf(socket), 1);
        io.sockets.emit('users:update', clients);
    });
    io.sockets.emit('users:update', clients);
});

