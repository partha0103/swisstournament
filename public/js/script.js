$(document).ready(function(){
    var players = $('.players');
    var addPlayer = $('.addPlayer');
    var th_name = $('.th_name')
    function tournaments() {
        $.ajax({
            url: '/playersInTour',
            success:function(data){
                console.log(data);
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
        alert("Hiiiii");
        $.ajax({
            url:'/tournamentStatus',
            success: function(data){

                th_name.html(th_name.html() + data[0].name);
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


function
