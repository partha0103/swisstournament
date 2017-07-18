$(document).ready(function(){
    var table = $('.tour_table')
    $('.tournament').on('click',function(event){
        var val = $(".in_tour").val();
        $(".in_tour").val("");
        var data = {
            name: val
        }
        $.ajax({
            method: 'POST',
            url: '/crtTournament',
            data: data,
            success: function(data){
                $('tbody').append("<tr><td><a class='tour' href='/tdetails/"+data.insertId+"'>"+val+"</a></td><td>Tournament yet to be finished</td><td>Yet to be declared</td></tr>")
            }
        })
    });

    function showPlayers(data){
        var div ="<div><input type='text' class='p_input' name='name'><button type='submit' class='p_insert'></button>"
        for(let i=0; i<data.length;i++){
            div = div + "<a class='player'>"+data[i].name+"</a>";
        }
        return div+"</div>"
    }
})


