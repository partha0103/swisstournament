
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

    app.route('/tDetails/:id', isLoggedIn)
        .get(tournament.playersInTour)

    app.route('/addPlayer')
        .get(tournament.registerPlayer);
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
