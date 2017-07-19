$(document).ready(function(){
    var players = $('.players');
    var addPlayer = $('.addPlayer');
    var th_name = $('.th_name');
    var r_table = $('.r_table');
    var r_details = $('.r_details');
    var status = $('.status');
    function playerDetails() {
        var id = $('.tournament_id').val();
        $.ajax({
            url: '/playersInTour/' + id,
            success:function(data){
                $('.players_body').html(data);
            }
        })
    }

    function standings(){
        $.ajax({
            url: '/standings/' + $('.tournament_id').val(),
            success: function(standings){
                $('.st_table').html(standings);
            }
        })
    }

    $('.mr_submit').on('click', function(event){
        var data = {
            name: [],
            round: $('.hide').val(),
            status: "ended",
            tournament_id: $('.tournament_id').val()
        };
        console.log($('.hide').val());
        $.each($('select.winner_list'), function(){
            data.name.push($(this).val());
        });
        $.ajax({
            url: '/executeRound',
            method: "post",
            data: data,
            success:function(result){
                $('#mr_modal').modal('hide');
                standings();
                countPlayers();
                updateTstatus();
                console.log(data);
                $.notify("Successfully played round: " + data.round, "info");
            }
        })
    })

    function updateTstatus(){
        $.ajax({
            url:'/updateTstatus/' + $('.tournament_id').val(),
            success: function(data){
                tournamentStatus();
            }
        })
    }

    function tournamentStatus(){
        $.ajax({
            url:'/tournamentStatus/'+ $('.tournament_id').val(),
            success: function(data){
                $('.t_status').html("Tournament Status: "+data[0].status);
                th_name.html("Tournament Name: "+ data[0].name);
                var tour_status = data[0].status;
                if(tour_status == "On progress"){
                    countPlayers();
                    winner();
                    $(".addPlayer").attr('disabled', true);
                    addPlayer.html("Add");
                    $('.add_exist').html("Add Existing");
                    $(".add_exist").attr('disabled', true);
                }
                else if(tour_status == "Finished"){
                    countPlayers();
                    winner();
                    addPlayer.html("Add");
                    $(".addPlayer").attr('disabled', true);
                    $('.add_exist').html("Add Existing");
                    $(".add_exist").attr('disabled', true);
                }
                else if(tour_status == "Yet to start"){
                    r_table.hide();
                }
            }
        })
    }

    function countPlayers(){
        $.ajax({
            url: '/count/' + $('.tournament_id').val(),
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
                    $.notify("No of players is not power of 2","warn");
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
            'name': name,
            'tournament_id': $('.tournament_id').val()
        }
        $.ajax({
            type: "POST",
            data: data,
            url: '/registerPlayer',
            success: function(data){
                if(data.flag){
                    playerDetails();
                    standings();
                    $.notify(data.message, "success");
                }
                else{
                    $.notify(data.message, "error");
                }
            }
        })
    });

    status.on('click', function(){
        countPlayers();
    });

    function roundStatus(){
        $.ajax({
            url: '/roundstatus/'+ $('.tournament_id').val(),
            success:function(data){
                var row = 0;
                for(let i=0; i<data.count;i++){
                    if(data.status[i]){
                        if(data.status[i].r_status == 'ended'){
                            $(`*[data-sid="`+i+`"]`).html(data.status[i].r_status);
                            $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                            $(`*[data-rid="`+i+`"]`).prop('disabled', false);
                        }
                    }
                    else if(row > 0){
                        $(`*[data-mrid="`+i+`"]`).attr('disabled', true);
                        $(`*[data-rid="`+i+`"]`).prop('disabled', true);
                        row = row + 1;
                    }
                    else if(row == 0){
                        $(`*[data-rid="`+i+`"]`).prop('disabled', true);
                        row = row +1;
                    }
                }
            }
        })

    }

    $("#mr_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-rmid'));
        event.stopPropagation();
        $.ajax({
            url: '/pairings/'+ round + "/" + $('.tournament_id').val(),
            success: function(pairs){
                var result  = pairs + "<input class='hide' type='hidden'value='"+round+"'>"
                $('.m_body').html(result);
            }
        })
    });

    $("#p_modal").on('show.bs.modal', function(event){
        var a = event.relatedTarget;
        var round = Number($(a).attr('data-rid'));
        event.stopPropagation();
        $.ajax({
            url: '/getroundResult/'+ round + "/" + $('.tournament_id').val(),
            success: function(results){
                var result = winnerTable(results);
                $('.p_body').html(result);
            }
        })
    });
    $("#adde_modal").on('show.bs.modal', function(event){
        event.stopPropagation();
        $.ajax({
            url: '/addExisting/' + $('.tournament_id').val(),
            success: function(list){
                $('.add_existing').html(list);
            }
        })
    });

    $('.add_existing').delegate('.add_e', "click", function(event){
        var data = {
            name: "",
            id: $('.tournament_id').val()
        }
        console.log();
        var row = $(this).parent();
        data.name = row.children('.exist_player').html();
        $.ajax({
            method: 'post',
            data: data,
            url: '/registerExisting',
            success: function(result){
                row.remove();
                playerDetails();
                standings();
            }
        })
    })

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

    function winner(){
        $.ajax({
            url: '/winner/' + $('.tournament_id').val(),
            success: function(winner){
                $('.winner_display').html('Winner: ' + winner);
            }
        })
    }

    tournamentStatus();
    playerDetails();
    standings();
    winner();
})



