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
    helpers = require('./helpers'),
    _ = require('underscore');


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

var getRoomUsers = function(room){
    return _.pluck(room, 'userName');
};

// Set up socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    socket.on('room', function(room){
        socket.join(room);
        socket.userName = "Guest" + io.sockets.clients(room).length;
        socket.userRoom = room;
        io.sockets.in(room).emit('users:update', getRoomUsers(io.sockets.clients(room)));

    });

    socket.on('nameChange', function(data){
        socket.userName = data;
    })

    socket.on('disconnect', function(){
        socket.leave(socket.userRoom);
        io.sockets.in(socket.userRoom).emit('users:update', getRoomUsers(io.sockets.clients(socket.userRoom)));
    })
});

