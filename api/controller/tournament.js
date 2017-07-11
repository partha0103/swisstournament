var tournament = require('./../../lib/tournament.js');


exports.countPlayers = (req, res)=>{
    var tournament_id = req.params.tournament_id;
    tournament.countPlayers(tournament_id, function(count){
        res.json(count);
    })
}
exports.getTournaments = (req, res)=>{
    var user_id = req.params.id;
    tournament.getTournaments(user_id,function(result){
        res.json(result);
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
    var user_id = req.params.id;
    tournament.create_tournament(user_id, function(result){
        res.json(result);
    })
}

exports.registerPlayer = (req, res)=>{
    var tournament_id = req.session.passport.tournament_id;
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
