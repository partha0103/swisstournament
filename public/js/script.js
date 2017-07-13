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
                $('.st_body').html(st_table);
            }
        })
    }

    function executeRound(){
        // var val =
    }

    function w_list(){
        $('select').on('click', function(){

        })
    }

    $('.mr_submit').on('click', function(event){
        var data = {
            name: [],
            round: $('.hide').val(),
            status: "ended"
        };
        $.each($('select.winner_list'), function(){
            data.name.push($(this).val());
        });
        $.ajax({
            url: '/executeRound',
            method: "post",
            data: data,
            success:function(){
                standings();
                roundStatus();
            }
        })
    })

    function tournamentStatus(){
        $.ajax({
            url:'/tournamentStatus',
            success: function(data){
                console.log(data);
                $('.t_status').html(data[0].status);
                th_name.html(th_name.html() + data[0].name);
                var tour_status = data[0].status;
                if(tour_status == "started" || tour_status == "finished"){
                    $(".addPlayer").attr('disabled', true);
                }
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
                    var t_rows = crtRoundTable(max_rounds,data);
                    r_details.html(t_rows);
                    r_table.show();
                    roundStatus();
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

    function roundStatus(){
        $.ajax({
            url: '/roundstatus',
            success:function(data){
                var count = 0;
                for(let i=0; i<data.length;i++){
                    if(data[i].r_status = "ended"){
                        $(`*[data-sid="`+i+`"]`).html(data[i].r_status);
                        $(`*[data-pid="`+i+`"]`).attr('disabled', true);
                        $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                    }
                    else{
                        console.log(count);
                        $(`*[data-sid="`+i+`"]`).html('Not started');
                        if(count > 0){
                            $(`*[data-pid="`+i+`"]`).attr('disabled', true);
                            $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                        }
                        count++;
                    }
                }
            }
        })

    }

    $("#r_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-pid'))+ 1;
        roundStatus();
        event.stopPropagation();
        $.ajax({
            url: '/pairings/'+ round,
            success: function(pairs){
                var result = showPairings(pairs);
                $('.modal-body').html(result);
            }
        })
    });

    $("#mr_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-rmid'));
        event.stopPropagation();
        $.ajax({
            url: '/pairings/'+ round,
            success: function(pairs){
                console.log(pairs);
                var result = showReportMatch(pairs);
                result  = result + "<input class='hide' type='hidden'value='"+round+"'>"
                $('.m_body').html(result);
            }
        })
    });



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
                `</td><td class='r_status' data-sid='`+i+`'>`+ `Not started`+
                `</td><td><button class='btn btn-primary r_result' data-rid="`+i+`">Result</button></td><td><button class='r_report btn btn-primary' data-toggle="modal" data-target="#mr_modal" data-mrid="`+i+`"">Reportmatch</button></td><td><span class='r_pairings'><button class="btn btn-primary" data-toggle="modal" data-target="#r_modal" data-pid="`+i+`">Pairings</button></span></td></tr>`
    }
    return t_rows
}

function isPowOf2(n){
    return (Math.log2(n)) % 1 == 0;
}

function showPairings(pairs){
    var result = ""
    pairs.forEach(function(pair){
        result = result + `<h3>`
                + pair.player1+ ` vs `+ pair.player2+`</h3>`
    });
    return result;
}


function showReportMatch(pairs){
    var result = "<h1><h1>";
    pairs.forEach(function(pair){
        result  = result + `<h4> `+
                pair.player1+ ` vs `+ pair.player2+` </h4> `+
                `<select class='form-control winner_list' name='winner'>
                    <option value='`+pair.player1+`'>`+pair.player1+`</option>
                    <option value='`+pair.player2+`'>`+pair.player2+`</option>
                </select>`
    });
    return result ;
}
