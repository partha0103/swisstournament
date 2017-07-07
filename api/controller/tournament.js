var mysql = require('mysql');

var get_connection =  ()=>{
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'mountblue',
      database : 'tournament'
    });
    connection.connect();
    return connection;
}

exports.countPlayers = (req, res)=>{
    var tournament_id = req.params.tournament_id;
    var connection = get_connection();
    connection.query(stmt,tournament_id,function(error,result) {
        connection.end();
        if(error){
            throw error;
        }
        var count = result[0].no_player;
        res.json(count);
    });
}
exports.getTournaments = (req, res)=>{
    var user_id = req.params.id;
    var stmt = "select * from tournament where user_id= ?";
    var connection = get_connection();
    connection.query(stmt,user_id,function(error, results){
        connection.end();
        if(error){
            throw error;
        }
        res.json(results);
    });
}



exports.playerDetails = (req, res)=>{
    var user_id = req.params.user_id;
    var tournament_id = req.params.tournament_id;
}
