
module.exports = (app,passport) => {
    const tournament = require('../controller/tournament.js');

    app.get('/', (req, res)=>{
        res.render('index.hbs');
    });

    app.get('/login', (req,res)=>{
        res.render('login.hbs');
    })

    app.get('/signup', (req, res)=>{
        res.render('signup.hbs');
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/auth/google', passport.authenticate('google',
    {
        scope : 'email'
    }
    ));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }
     ));

    app.get('/auth/facebook', passport.authenticate('facebook',
    {
        scope : 'email'
    }
    ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }
     ));

    app.route('/profile', isLoggedIn)
        .get(tournament.getTournaments);

    app.route('/crtTournament', isLoggedIn)
        .post(tournament.createTournament);

    app.get('/tDetails/:id', isLoggedIn, (req, res)=>{
        req.session.tournament_id = req.params.id;
        var tournament_id = req.params.id;
        res.render('dashboard.hbs',{
            'tournament_id': tournament_id
        });
    })

    app.route('/playersInTour/:id', isLoggedIn)
        .get(tournament.playersInTour)

    app.route('/registerPlayer', isLoggedIn)
        .post(tournament.registerPlayer);

    app.route('/standings/:id', isLoggedIn)
        .get(tournament.standings);

    app.route('/tournamentStatus/:id', isLoggedIn)
        .get(tournament.tournamentStatus);

    app.route('/count/:id', isLoggedIn)
        .get(tournament.countPlayers);

    app.route('/pairings/:round/:id', isLoggedIn)
        .get(tournament.pairings);

    app.route('/executeRound', isLoggedIn)
        .post(tournament.executeRound);

    app.route('/roundstatus/:id', isLoggedIn)
        .get(tournament.roundstatus)

    app.route('/updateTstatus/:id', isLoggedIn)
        .get(tournament.updateTstatus)

    app.route('/getroundResult/:round/:id', isLoggedIn)
        .get(tournament.getroundResult)

    app.route('/winner/:id', isLoggedIn)
        .get(tournament.winner)

    app.route('/addExisting/:id', isLoggedIn)
        .get(tournament.addExisting);

    app.route('/registerExisting', isLoggedIn)
        .post(tournament.registerExisting);
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
