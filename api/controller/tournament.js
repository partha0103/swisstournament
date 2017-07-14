var tournament = require('./../../lib/tournament.js');


exports.countPlayers = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.countPlayers(tournament_id, function(count){
        res.json(count);
    })
}
exports.getTournaments = (req, res)=>{
    var user_id = req.session.passport.user;
    tournament.getTournaments(user_id,function(result){
        res.render('profile.hbs',{
            'result': result
        });
    })
}



exports.playerDetails = (req, res)=>{
    var user_id = req.params.user_id;
    var tournament_id = req.params.tournament_id;
    tournament.playerDetails(user_id, tournament_id, function(result){
        res.json(result);
    });
}

exports.createTournament = (req, res)=>{
    var user_id = req.session.passport.user;
    var name = req.body.name;
    tournament.create_tournament(user_id,name, function(result){
        res.json(result);
    })
}

exports.registerPlayer = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    console.log(tournament_id, "Hello");
    var user_id = req.session.passport.user;
    var name = req.body.name;
    tournament.registerPlayer(name, user_id, tournament_id,function(result){
        res.json(result);
    })
}

exports.standings = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.currentStandings(tournament_id, function(result){
        res.json(result);
    })
}

exports.pairings = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    var round = req.params.round;
    tournament.swissPairings(tournament_id, function(result){
        res.json(result);
    })
}

exports.startTournament = (req,res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.startTournament(tournament_id,function(flag){
        if(flag){
            res.json(true);
        }
        else{
            res.json(false);
        }
    })
}

exports.playTournament = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.playTournament(tournament_id, function(result){
        if(result){
            res.json(result);
        }
        else{
            res.json("No of players is not power of 2")
        }
    })
}

exports.playersInTour = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id ;
    tournament.playersInTour(tournament_id,function(result){
        res.json(result);
    })
}

exports.tournamentStatus = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id ;
    tournament.tournamentStatus(tournament_id, function(result){
        res.json(result);
    })
}


exports.executeRound = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    var winner = req.body.name;
    var round = Number(req.body.round);
    var status = req.body.status;
    tournament.play(tournament_id,round, winner,status, function(result){
        res.json(result);
    })
}

exports.roundstatus = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.roundstatus(tournament_id, function(result){
        res.json(result);
    })
}

exports.updateTstatus = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.updateTstatus(tournament_id, function(result){
        res.json(result);
    })
}

exports.getroundResult = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    var round = req.params.round;
    console.log(round,"opp");
    tournament.getroundResult(tournament_id, round, function(result){
        res.json(result);
    })
}

exports.winner = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
    tournament.winner(tournament_id, function(result){
        res.json(result);
    })
}
