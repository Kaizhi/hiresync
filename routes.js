var passport = require('passport'),
    Account = require('./models/account');

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
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};