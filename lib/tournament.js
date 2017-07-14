var mysql = require('mysql');
var Match = require('./matches').Match;
function get_connection() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'mountblue',
      database : 'Tournament'
    });
    connection.connect();
    return connection
}

function getTournaments(user_id,cb){
    var stmt = "select * from tournaments where user_id= ?";
    var connection = get_connection();
    connection.query(stmt,user_id,function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}


function playersInTour(tournament_id, cb){
    var stmt = "select * from players where tournament_id= ?";
    var connection = get_connection();
    connection.query(stmt,tournament_id,function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}

function playerDetails(user_id,tournament_id, cb){
    playerInTour(tournament_id, function(t_players){
        var connection = get_connection();
        var stmt = "select name from players where user_id = ?"
        connection.query(stmt, user_id,function(error, u_players){
            if(error)
                throw error;
            else{
                var result= {
                    t_players: t_players,
                    u_players: u_players
                }
                res.json(result);
            }
        })
    })
}

function registerPlayer(name,user_id,tournament_id,cb){
    if(isStarted(tournament_id, function(flag){
        if(flag){
            cb(false,null);
        }
        else{

            var connection = get_connection();
            var stmt = "insert into players(user_id,tournament_id,name) values(?, ?,?);";
            connection.query(stmt,[user_id,tournament_id,name],function(error, results){
                connection.end();
                if(error){
                    throw error;
                }
                cb(results);
            });
        }
    }));

}

function countPlayers(tournament_id,cb){
    var connection = get_connection();
    var stmt = "select count(*) as no_player from players where tournament_id=?";
    connection.query(stmt,tournament_id,function(error,result) {
        connection.end();
        if(error){
            throw error;
        }
        var count = result[0].no_player;
        cb(count);
    });
}
function isPowOf2(n){
    return (Math.log2(n)) % 1 == 0;
}
function startTournament(tournament_id,cb){
    countPlayers(tournament_id,function(count){
        if(isPowOf2(count)){
            cb(true);
        }
        else
            cb(false);
    })
}

function deleteMatches(tournament_id,cb){
    var connection = get_connection();
    var stmt = "delete from matches where tournament_id = ?;";
    connection.query(stmt,tournament_id,function(error,result) {
        connection.end();
        if(error){
            throw error;
        }
        cb('All the details from the match deleted');
    });
}

function deletePlayers(cb){
    var connection = get_connection();
    var stmt = "delete from players where tournament_id = ?";
    connection.query(stmt,tournament_id,function(error,result) {
        connection.end();
        if(error){
            throw error;
        }
        cb('All the players from the table deleted');
    });
}

function currentStandings(tournament_id,cb){
    var connection = get_connection();
    var stmt = `select p.id, p.name, m.matches as ma, w.wins as wins from players as p join matchs_count as m on p.id = m.player_id join win_count as w on   p.id = w.player_id where p.tournament_id = ? order by wins desc;`
    connection.query(stmt,tournament_id,function(error,results) {
        connection.end();
        if(error){
            throw error;
        }
        var standings = [];
        results.forEach(function(result,index){
            standings.push({
                id: result.id,
                name: result.name,
                no_matches: result.ma,
                wins: result.wins,
                losses: (result.ma- this.wins)
            });
        });
        cb(standings);
    });
}

function swissPairings(tournament_id,cb){
    buildMatches(tournament_id,function(matches){
        currentStandings(tournament_id,function(standings){
            var pairings = [];
            while(standings.length > 0){
                var p1_name = standings[0].name;
                var round = standings[0].no_matches;
                var player1 = standings.splice(0,1)[0].id;
                for(let i = 0; i < standings.length ; i++){
                    var player2 = standings[i].id;
                    var p2_name = standings[i].name;
                    var match1 = {
                        player1: player1,
                        player2: player2
                    };
                    var match2 = {
                        player1: player2,
                        player2: player1
                    };
                    if(matches.hasPlayed(match1) || matches.hasPlayed(match2)){

                    }
                    else{
                        var pair = {
                            player1: player1,
                            p1_name: p1_name,
                            player2: player2,
                            p2_name: p2_name,
                            round: round
                        };
                        pairings.push(pair);
                        standings.splice(0,1);
                        break;
                    }
                }
            }
            cb(pairings);
        });
    });
}

function isStarted(tournament_id, cb){
    var stmt = "select tournament_id from matches where tournament_id= ?";
    var connection = get_connection();
    connection.query(stmt, tournament_id,function(error, result){
        connection.end();
        if(error){
            throw error;
        }
        if(result.length == 0){
            cb(false);
        }
        else{
            cb(true);
        }
    })
}

function isFinished(tournament_id, cb){
    countPlayers(tournament_id, function(count){
        var max_round = Math.log2(count);
        var stmt = "select * from matchs_count where tournament_id = ? LIMIT 1";
        console.log(max_round);
        var connection = get_connection();
        connection.query(stmt,tournament_id,function(error, results){
            if(error){
                throw error;
            }
            else{
                if((results[0].matches) == max_round){
                    var connection = get_connection();
                    var winner = results[0].player_id;
                    console.log("winner", winner);
                    var stmt = "select name from players where id = ?";
                    connection.query(stmt, winner, function(error, result){
                        if(error)
                            throw error();
                        else{
                            var connection = get_connection();
                            console.log(result, "Helcfjdfjkdakahfdkl");
                            var winner_name = result[0].name;
                            var stmt = "update tournaments set winner = ? where id = ?";
                            connection.query(stmt, [winner_name, tournament_id], function(error, result){
                                if(error)
                                    throw error;
                                else
                                    cb(true);
                            });
                        }
                    })
                }
                else{
                    cb(false);
                }
            }
        });
    })
}

function playTournament(tournament_id, cb){
    swissPairings(tournament_id, function(matches){
        countPlayers(tournament_id, function(count){
            var max_round = Math.log2(count);
            var round = matches[0].round+ 1;
            if(round == max_round){
                cb(false);
            }
            else{
                var w_list = [];
                matches.forEach(function(match, index, matches){
                    console.log("Hello");
                    player1 = match.player1;
                    player2 = match.player2;
                    var winner = player1;
                    var w_name = "";
                    if(Math.random() > 0.49){
                        winner = player1;
                        w_name = match.p1_name;
                    }
                    else{
                        winner = player2;
                        w_name = match.p2_name;
                    }
                    var c_match = {
                        p1_name: match.p1_name,
                        p2_name: match.p2_name,
                        w_name: w_name
                    }
                    w_list.push(c_match);
                    var stmt = "insert into matches(tournament_id, player1_id, player2_id, winner_id) values(?,?,?,?)"
                    var connection = get_connection();
                    connection.query(stmt, [tournament_id,player1, player2, winner], function(error, result){
                        connection.end();
                        if(error)
                            throw error;
                        else if(index == matches.length-1){
                            cb(w_list);
                        }
                    });
                })
            }
        })

    })

}


function matchesPlayed(cb){
    var connection = get_connection();
    var stmt = "select * from  matches where tournament_id = ?";
    connection.query(stmt,tournament_id,function(error,results) {
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}

function buildMatches(tournament_id,cb){
    var connection = get_connection();
    var stmt = "select * from  matches where tournament_id = ?";
    connection.query(stmt,tournament_id,function(error,results) {
        connection.end();
        if(error){
            throw error;
        }
        var matches = new Match();
        for(var row of results){
            var match = {
                player1: row.player1_id,
                player2: row.player2_id
            }
            matches.addMatch(match);
        }
        cb(matches);
    });
}

function create_tournament(user_id,name,cb){
    var connection = get_connection();
    var stmt = 'Insert into tournaments(user_id, name) values(?, ?)';
    connection.query(stmt,[user_id,name],function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}

function tournamentDetails(tournament_id, cb){
    var stmt = "select name from player where id= ?";
    var connection = get_connection();
    connection.query(stmt,tournament_id,function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}


function play(tournament_id,round,winner, status,cb){
    swissPairings(tournament_id, function(matches){
        countPlayers(tournament_id, function(count){
            var max_round = Math.log2(count);
            console.log(matches);
            var round = matches[0].round;
            if(round == max_round){
                cb(false);
            }
            else{
                var w_list = [];
                matches.forEach(function(match, index, matches){
                    console.log("Hello");
                    player1 = match.player1;
                    player2 = match.player2;
                    var m_winner = winner[index];
                    var c_match = {
                        p1_name: match.p1_name,
                        p2_name: match.p2_name,
                        winner: m_winner
                    }
                    var winner_id = "";
                    if(match.p1_name == m_winner){
                        winner_id = player1;
                    }
                    else{
                        winner_id = player2;
                    }
                    console.log(winner_id)
                    w_list.push(c_match);
                    var stmt = "insert into matches(tournament_id, player1_id, player2_id, winner_id,round, r_status) values(?,?,?,?,?,?)"
                    var connection = get_connection();
                    connection.query(stmt, [tournament_id,player1, player2, winner_id, round, status], function(error, result){
                        connection.end();
                        if(error)
                            throw error;
                        else if(index == matches.length-1){
                            cb(w_list);
                        }
                    });
                })
            }
        })

    })

}

function roundstatus(tournament_id, cb){
    countPlayers(tournament_id, function(count){
        var stmt = "select * from matches where tournament_id = ? group by round";
        var connection = get_connection();
        connection.query(stmt,[tournament_id],function(error, results){
            connection.end();
            if(error){
                throw error;
            }
            var obj = {
                count: count,
                status: results
            }
            cb(obj);
        });
    })
}


function updateTstatus(tournament_id,cb){
    console.log("HelloHiiiiiiiiiiiiiiiii");
    isStarted(tournament_id,function(flag){
        console.log(flag,"Hello");
        if(flag){
            isFinished(tournament_id, function(fw){
                var status = "";
                if(fw){
                    status  = "Finished";
                }
                else{
                    status = "On progress";
                }
                var stmt = "update tournaments  set status = ?  where  id = ?";
                var connection = get_connection();
                connection.query(stmt,[status,tournament_id],function(error, results){
                    connection.end();
                    if(error){
                        throw error;
                    }
                    cb(results);
                });
            })
        }
    })
}

function getroundResult(tournament_id,round, cb){
    var stmt = `select (select name from players where id = t.player1_id) as player1_name,
                (select name from players where id = t.player2_id) as player2_name,
                (select name from players where id = t.winner_id) as winner_name
                from matches t where t.tournament_id = ? and
                round = ?`
    var connection = get_connection();
    console.log("round", "yudgdld");
    connection.query(stmt,[tournament_id, round],function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        console.log(results, "jnjndk");
        cb(results);
    });
}

function getTstatus(tournament_id, cb){
    console.log(tournament_id);
    var stmt = "select * from tournaments where id = ?";
    var connection = get_connection();
    connection.query(stmt,tournament_id,function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        cb(results);
    });
}

module.exports = {
    getTournaments: getTournaments,
    playersInTour: playersInTour,
    playerDetails: playerDetails,
    registerPlayer: registerPlayer,
    countPlayers: countPlayers,
    startTournament: startTournament,
    deleteMatches: deleteMatches,
    deletePlayers: deletePlayers,
    currentStandings: currentStandings,
    swissPairings: swissPairings,
    isStarted: isStarted,
    playTournament: playTournament,
    matchesPlayed: matchesPlayed,
    create_tournament: create_tournament,
    tournamentDetails: tournamentDetails,
    tournamentStatus: getTstatus,
    play: play,
    updateTstatus: updateTstatus,
    roundstatus: roundstatus,
    getroundResult: getroundResult
}
