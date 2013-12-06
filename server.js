//Module dependencies.
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
    _ = require('underscore'),
    connect = require('connect'),
    MongoStore = require('connect-mongo')(connect);


var app = express();
// Configuration
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compress());

    app.use(express.cookieParser('sample secret'));
    mongoose.connect('mongodb://localhost/passport-accounts');

    app.use(express.session({
        secret: 'secret',
        cookie: { maxAge: new Date(Date.now() + 3600000)},
        store: new MongoStore({
                db: mongoose.connection.db
            },
            function(err) {
                console.log(err || 'connect-mongodb setup ok');
            })
    }));

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

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// Setup routes and sio handling
require('./routes')(app);
require('./socket')(server);
