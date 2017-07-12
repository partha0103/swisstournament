$(document).ready(function(){
    var players = $('.players');
    var addPlayer = $('.addPlayer');
    var th_name = $('.th_name');
    var r_table = $('.r_table');
    var r_details = $('.r_details');
    var status = $('.status');
    function tournaments() {
        $.ajax({
            url: '/playersInTour',
            success:function(data){
                r_table.hide();
                var result = addNames(data);
                players.append(result);
            }
        })
    }

    function standings(){
        $.ajax({
            url: '/standings',
            success: function(standings){
                var st_table = crtStandings(standings);
                $('tbody').html(st_table);
            }
        })
    }

    function tournamentStatus(){
        $.ajax({
            url:'/tournamentStatus',
            success: function(data){

                th_name.html(th_name.html() + data[0].name);
            }
        })
    }

    function count(){
        $.ajax({
            url: '/count',
            success: function(data){
                var no_players = data;
                if(isPowOf2(no_players)){
                    var max_rounds = Math.log2(no_players);
                    var t_rows = crtRoundTable(max_rounds);
                    r_details.html(t_rows);
                    r_table.show();
                }
            }
        })
    }

    function addNames(data) {
        var names = "";
        data.forEach(function(data){
            names  = names + "<h4>"+data.name+"</h4>"
        })
        return names;
    }

    addPlayer.on('click', function(){
        var name = $('.p_input').val();
        var data = {
            'name': name
        }
        $.ajax({
            type: "POST",
            data: data,
            url: '/registerPlayer',
            success: function(data){
                players.append(name);
                standings();
            }
        })
    });

    status.on('click', function(){
        count();
    });


    $(".r_pairings").on('click', function(){
        $('#r_modal').modal('show');
    })

    tournaments();
    standings();
    tournamentStatus();

})

function crtStandings(standings){
    var st_table = "";
    for(var i=0; i<standings.length; i++){
        st_table = st_table + `<tr><td>`+standings[i].name+`</td><td>`+standings[i].no_matches+`</td><td>`+standings[i].wins+`</td><td>`+standings[i].losses+`</td><td>`+standings[i].no_matches+`</td></tr>`;
    }
    return st_table;
}


function crtRoundTable(n){
    var t_rows = "<tr>";
    for(let i=0; i<n;i++){
        t_rows = t_rows + `<tr><td>`+(i+1)+
                `</td><td class='r_status'>`+`Status`+
                `</td><td><button class='r_result'>Result</button></td><td><button class='r_report'>MatchReport</button></td><td><button class='r_pairings' data-toggle="modal" data-target="#r_modal">Pairings</button></td></tr>`
    }
    return t_rows
}

function isPowOf2(n){
    return (Math.log2(n)) % 1 == 0;
}
