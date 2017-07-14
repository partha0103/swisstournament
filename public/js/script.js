$(document).ready(function(){
    var players = $('.players');
    var addPlayer = $('.addPlayer');
    var th_name = $('.th_name');
    var r_table = $('.r_table');
    var r_details = $('.r_details');
    var status = $('.status');


    playerDetails();
    standings();
    tournamentStatus();
    function playerDetails() {
        $.ajax({
            url: '/playersInTour',
            success:function(data){
                r_table.hide();
                var result = addNames(data);
                $('.player_name').html(result);
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
                $('#mr_modal').modal('hide')
                standings();
                countPlayers();
                updateTstatus();
            }
        })
    })

    function updateTstatus(){
        $.ajax({
            url:'/updateTstatus',
            success: function(data){
                tournamentStatus();
                console.log(data);
            }
        })
    }

    function tournamentStatus(){
        $.ajax({
            url:'/tournamentStatus',
            success: function(data){
                $('.t_status').html(data[0].status);
                th_name.html("Tournament Name: "+ data[0].name);
                var tour_status = data[0].status;
                if(tour_status == "On progress"){
                    $(".addPlayer").attr('disabled', true);
                    addPlayer.html("Add Player");
                    $(".status").html("Resume");
                    $('.add_exist').html("Add Existing");
                    $(".add_exist").attr('disabled', true);
                }
                else if(tour_status == "Finished"){
                    $(".status").html("Round Table");
                    addPlayer.html("Add Player");
                    $(".status").removeClass("btn btn-primary status col-md-6").addClass("btn btn-success winner col-md-6");
                    $(".addPlayer").attr('disabled', true);
                    addPlayer.addClass("btn btn-primary col-md-6");
                    $('.add_exist').html("Add Existing");
                    addPlayer.html("Add Player");
                    $(".add_exist").attr('disabled', true);
                }
            }
        })
    }

    function countPlayers(){
        $.ajax({
            url: '/count',
            success: function(data){
                var no_players = data;
                if(isPowOf2(no_players)){
                    var max_rounds = Math.log2(no_players);
                    var result = crtRoundTable(max_rounds);
                    $('.r_details').html(result);
                    r_table.show();
                    roundStatus();
                }
                else{
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
        $('.p_input').val("");
        var data = {
            'name': name
        }
        $.ajax({
            type: "POST",
            data: data,
            url: '/registerPlayer',
            success: function(data){
                playerDetails();
                standings();
            }
        })
    });

    status.on('click', function(){
        countPlayers();
    });

    function roundStatus(){
        $.ajax({
            url: '/roundstatus',
            success:function(data){
                var row = 0;
                for(let i=0; i<data.count;i++){
                    if(data.status[i]){
                        if(data.status[i].r_status == 'ended'){
                            $(`*[data-sid="`+i+`"]`).html(data.status[i].r_status);
                            $(`*[data-pid="`+i+`"]`).attr('disabled', true);
                            $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                        }
                    }
                    else if(row > 0){
                        $(`*[data-rid="`+i+`"]`).attr('disabled', true);
                        $(`*[data-pid="`+i+`"]`).attr('disabled', true);
                        $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                        row = row + 1;
                    }
                    else if(row == 0){
                        console.log("hello");
                        row = row + 1;
                        $(`*[data-rid="`+i+`"]`).prop('disabled', true);
                    }
                }
            }
        })

    }

    $("#r_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-pid'))+ 1;
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
                var result = showReportMatch(pairs);
                result  = result + "<input class='hide' type='hidden'value='"+round+"'>"
                $('.m_body').html(result);
            }
        })
    });

    $("#p_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-rid'));
        event.stopPropagation();
        $.ajax({
            url: '/getroundResult/'+ round,
            success: function(results){
                var result = winnerTable(results);
                $('.p_body').html(result);
            }
        })
    });

    $("#w_modal").on('show.bs.modal', function(event){
        event.stopPropagation();
        $.ajax({
            url: '/winner',
            success: function(winner){
                $('.w_header').html(winner);
            }
        })
    });

    $("#adde_modal").on('show.bs.modal', function(event){
        event.stopPropagation();
        $.ajax({
            url: '/addExisting',
            success: function(list){
                $('.add_existing').html(list);
            }
        })
    });

})





function crtStandings(standings){
    var st_table = "";
    for(var i=0; i<standings.length; i++){
        st_table = st_table + `<tr><td>`+ standings[i].name +
                    `</td><td>`+standings[i].no_matches+`</td><td>` +
                    standings[i].wins+`</td><td>`+(standings[i].no_matches - standings[i].wins)+
                    `</td><td>`+standings[i].no_matches+`</td></tr>`;
    }
    return st_table;
}


function crtRoundTable(n){
    var t_rows = "<tr>";
    for(let i=0; i<n;i++){
        t_rows = t_rows + `<tr><td>`+(i+1)+
                `</td><td class='r_status' data-sid='`+i+`'>`+ `Not started`+
                `</td><td><button class='btn btn-primary r_result' data-toggle="modal" data-target="#p_modal"
                 data-rid="`+i+` ">Result</button></td><td><button class='r_report btn btn-primary' data-toggle="modal" data-target="#mr_modal" data-mrid="`+i+`"">Reportmatch</button></td>`
    }
    return t_rows
}

function isPowOf2(n){
    return (Math.log2(n)) % 1 == 0;
}

function showPairings(pairs){
    var result = ""
    pairs.forEach(function(pair){
        result = result + `<h4>`
                + pair.p1_name+ `vs`+ pair.p2_name+`</h4>`
    });
    return result;
}


function showReportMatch(pairs){
    var result = "<h1><h1>";
    pairs.forEach(function(pair){
        result  = result + `<h4> `+
                pair.p1_name+ ` vs `+ pair.p2_name+` </h4> `+
                `<select class='form-control winner_list' name='winner'>
                    <option value='`+pair.p1_name+`'>`+pair.p1_name+`</option>
                    <option value='`+pair.p2_name+`'>`+pair.p2_name+`</option>
                </select>`
    });
    return result ;
}


function winnerTable(results){
    var result = `<h1>Result<H1>`
    result = result + `<table class="table table-striped table-inverse">` +
                            `<thead>
                                <th>Player1</th>
                                <th>Player2</th>
                                <th>Winner</th>
                            </thead>
                            <tbody>`;
    for(let i=0; i<results.length; i++){
        result = result + `<tr>`+
                            `<td>`+results[i].player1_name+`</td>`+
                            `<td>`+results[i].player2_name+`</td>`+
                            `<td>`+results[i].winner_name+`</td>`+
                        `</tr>`
    }
    return result + '</h1>';
}

