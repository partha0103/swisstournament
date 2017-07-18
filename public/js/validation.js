"use strict"
var error_element = false;

$(document).ready(function(){

});

function emailValidation(email){
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}
