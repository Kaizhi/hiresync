var passport = require('passport'),
    Account = require('./models/account'),
    helpers = require('./helpers');

module.exports = function (app) {
    
    app.get('/', function (req, res) {
        res.render('index', { user : req.user });
    });

    app.get('/signup', function(req, res) {
        res.render('signup', { });
    });

    app.post('/signup', function(req, res) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.render('signup', {locals:{ account : account }});
            }

            res.redirect('/');
        });
    });

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { //exception occurred
                return next(err); 
            }
            if (!user) { //authenticate() failed 
                return res.render('login', {errors: true}); 
            }
            req.logIn(user, function(err) {
                if (err) { //exception occurred
                    return next(err); 
                }
                return res.render('app', {user: user});
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/app', function(req, res){
        res.redirect('app/' + helpers.generateHashId());
    });

    app.get('/app/:hash', function(req, res){
        res.render('app', {
            user: req.user,
            sessionhash: req.params.hash
        });
    });

    app.get('/api/user', function(req, res){
        if (req.user){
            return res.send(req.user);
        } 
        res.send(401);
    });
};