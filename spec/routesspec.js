var request = require('request');
var url = "http://localhost:8000/";
describe ("Home page server check", function() {
    it("Checking for the homepage", function(){
        request.get(url, function(error, response, body){
            expect(response.statusCode).toBe(200);
        })
    })
})
