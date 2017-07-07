module.exports = (app) => {
    const tournament = require('../controller/tournament.js');

    app.get('/', (req, res)=>{
        res.send("Hello world");
    });

    app.route('/tDetails/:id')
        .get(tournament.getTournaments);
    app.route('/pDetails/:user_id/:tournament_id')
        .get(tournament.playerDetails);

}
