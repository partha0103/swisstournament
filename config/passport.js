var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./dbconfig');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser   = require('body-parser');
// expose this function to our app using module.exports
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("select * from user where id = "+id,function(err,rows){
            done(err, rows[0]);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query(" select * from user where user_name = '"+username+"' ",function(err,rows){
            if (err)
                return done(err);
             if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUserMysql = new Object();
                var email = req.body.email;
                console.log(email);
                newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model
                var insertQuery = "INSERT INTO user ( user_name,email, password ) values ('"+ username+"','"+ email +"','"+ password +"')";
                connection.query(insertQuery,function(err,rows){
                newUserMysql.id = rows.insertId;
                req.session.passport.tournament = 2;
                return done(null, newUserMysql);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

         connection.query("SELECT * FROM `user` WHERE `user_name` = '" + username + "'",function(err,rows){
            if (err)
                return done(err);
             if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!( rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            req.body.user = rows[0].id;
            return done(null, rows[0]);

        });
    }));

};
