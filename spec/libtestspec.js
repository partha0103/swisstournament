var tournament = require('../lib/tournament');
describe("Tournament library testing", function() {
    it("No of players in the tournament",function(cb){
        tournament.countPlayers(12, function(result){
            expect(result).toBeGreaterThan(-1);
            cb();
        });
    });

    it("test for player registration", function(cb){
        tournament.registerPlayer(6, 12, 'Opppp', function(result){
            expect(result.message).toMatch("Successfully inserted");
            cb();
        })
    })
});
