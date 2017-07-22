// var request = require('request');
// var url = "http://localhost:8000";
// describe ("Home page server check", function() {
//     it("Checking for the homepage", function(done){
//         request.get(url, function(error, response, body){
//             expect(response.statusCode).toBe(200);
//             done();
//         })
//     })
// })

// describe("Tournament creation", function(){
//     beforeEach(function(){
//             console.log("Before each");
//             var data = {
//                 name :"Partha"
//             }
//             var url = "http://localhost:8000/crtTournament";
//             var options = {
//               method: 'post',
//               body: data,
//               json: true,
//               url: url
//           }
//           request(options, (err, res, body)=>{
//             console.log(res);
//           })
//         })

//     it("Checking for the tournament page", function(done){

//         request.get(url + "/count/9", function(error, response, body){
//             expect(body).toBe('4');
//             done();
//         })
//     })
// })
