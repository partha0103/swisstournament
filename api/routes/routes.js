
module.exports = (app,passport) => {
    const tournament = require('../controller/tournament.js');

    app.get('/', (req, res)=>{
        res.render('index.hbs');
    });

    app.get('/login', (req,res)=>{
        res.render('login.hbs');
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.route('/profile', isLoggedIn)
        .get(tournament.getTournaments);

    app.route('/crtTournament', isLoggedIn)
        .post(tournament.createTournament);

    app.get('/tDetails/:id', isLoggedIn, (req, res)=>{
        req.session.passport.tournament_id = req.params.id;
        res.render('dashboard.hbs');
    })

    app.route('/playersInTour', isLoggedIn)
        .get(tournament.playersInTour)

    app.route('/allPlayers', isLoggedIn)
        .get(tournament.playersInTour)

    app.route('/registerPlayer', isLoggedIn)
        .post(tournament.registerPlayer);
    app.route('/standings', isLoggedIn)
        .get(tournament.standings);

    app.route('/tournamentStatus', isLoggedIn)
        .get(tournament.tournamentStatus);

    app.route('/count', isLoggedIn)
        .get(tournament.countPlayers);

    app.route('/pairings', isLoggedIn)
        .get(tournament.pairings);
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
