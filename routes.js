var passport = require('passport'),
    mongoose = require('mongoose'),
    Account = require('./models/account'),
    Questions = require('./models/questions'),
    Recording = require('./models/recording'),
    helpers = require('./helpers');

module.exports = function(app) {
    app.all('/*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.get('/', function(req, res) {
        res.render('index', {
            user: req.user
        });
    });

    app.get('/signup', function(req, res) {
        res.render('signup', {});
    });

    app.post('/signup', function(req, res) {
        Account.register(new Account({
            username: req.body.username
        }), req.body.password, function(err, account) {
            if (err) {
                return res.render('signup', {
                    locals: {
                        account: account
                    }
                });
            } else {
                //auto login the newly created user and redirect to the app
                passport.authenticate('local')(req, res, function () {
                     res.redirect('/app');
                })
            }

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
                return res.render('login', {
                    errors: true
                });
            }
            req.logIn(user, function(err) {
                if (err) { //exception occurred
                    return next(err);
                }
                return res.redirect('app');
            });
        })(req, res, next);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/app', function(req, res) {
        res.redirect('app/' + helpers.generateHashId());
    });

    app.get('/app/:hash', function(req, res) {
        res.render('app', {
            user: req.user,
            sessionhash: req.params.hash
        });
    });

    /* API calls*/
    app.get('/api/user', function(req, res) {
        if (req.user) {
            return res.send(req.user);
        }
        res.send(401);
    });

    app.get('/api/questions', function(req, res, next) {
        if (req.user) {
            var Questions = mongoose.model('Questions');
            Questions.find({
                'user': req.user.username
            }, 'title content language _id', function(err, doc) {
                if (err) {
                    return res.send(500);
                }
                return res.send(doc);
            })
        } else {
            return res.send(401);
        }
    });

    app.post('/api/questions', function(req, res) {
        if (req.user) { //obligatory auth block
            var Questions = mongoose.model('Questions');
            var question = new Questions({
                title: req.body.title,
                content: req.body.content,
                user: req.user.username,
                language: req.body.language

            });
            question.save(function(err) {
                if (err) {
                    return res.json(500);
                }
            });
            return res.json(200);
        }
        res.json(401);
    });
    
    /* remove an existing question by id*/
    app.del('/api/questions/:id', function(req, res) {
        if (req.user) {
            var Questions = mongoose.model('Questions');
            Questions.find({
                'id': req.params.id
            }, 'title', function(err, doc) {
                if (err) {
                    return res.send(500);
                }
                doc.remove();
                return res.json(200);
            })
        } else {
            return res.send(401);
        }
    });

    app.post('/api/recording', function(req, res){
        if (req.user) {
            var Recording = mongoose.model('Recording');
            var recording = new Recording({
                title: req.body.title,
                events: req.body.events,
                user: req.user.username,
                startTime: req.body.startTime,
                language: req.body.language
            });
            recording.save(function(err) {
                if (err) {
                    return res.json(500);
                }
            });
            return res.json(200);
        }
        res.json(401);
    });

};