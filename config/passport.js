var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./dbconfig');
var auth = require('./auth');
var connection = mysql.createConnection(dbconfig.connection);
var bodyParser   = require('body-parser');
// expose this function to our app using module.exports
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log('inside serialize');
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

        connection.query(" select * from user where username = '"+username+"' ",function(err,rows){
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                var newUserMysql = new Object();
                var email = req.body.email;
                newUserMysql.email    = email;
                newUserMysql.password = password;
                console.log(email,"email");
                console.log(username, "user");
                console.log(password, "password");
                var insertQuery = "INSERT INTO user ( username,password ) values ('"+ username+"','"+ password +"')";
                connection.query(insertQuery,function(err,rows){
                    console.log(rows, 'rows');
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

     connection.query("SELECT * FROM `user` WHERE `username` = '" + username + "'",function(err,rows){
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

    passport.use(new FacebookStrategy({
        clientID        : auth.facebookAuth.clientID,
        clientSecret    : auth.facebookAuth.clientSecret,
        callbackURL     : auth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function(accessToken, refreshToken, profile, done) {
            console.log("inside facebook auth", profile._json.email);
            var stmt = "select * from user where email = ?";
            connection.query(stmt, [profile._json.email], function(error, result){
                console.log("inside kkkiioojfsf");
                if(error)
                    throw error;
                else if(result.length){
                    return done(null, result[0]);
                }
                else{
                        console.log(profile._json.email, "email");
                        var user = new Object();
                        user.email = profile._json.email;
                        user.password = '308ab220';
                        user.id = Number(profile._json.id);
                        console.log(profile._json, "useeeer");
                        var stmt = "Insert into user(id,username, password, flag, email) values(?,?, ?, ?, ?)";
                        connection.query(stmt, [user.id,user.email, user.password,0, user.email], function(error, result){
                            if(error)
                                throw error;
                            else{
                                console.log(result, "Hiiiihkhgsdkjfh");
                                return done(null, result[0]);
                            }
                        })
                    }
            });
        }
    ));
}
