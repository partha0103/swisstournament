"use strict"
var error_element = false;

$(document).ready(function(){
    $('#email').on('keyup', function(){
        if (!(emailValidation($(this).val()))) {
            console.log("hello");
            $(this).parent().removeClass('has-success');
            $(this).parent().addClass('has-error');
        }
        else{
            console.log("world");
            $(this).parent().removeClass('has-error');
            $(this).parent().addClass('has-success');
        }
    })
});

function emailValidation(email){
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}
