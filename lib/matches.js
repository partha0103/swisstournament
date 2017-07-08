var tournament = require('./tournament');
module.exports.Match = function(){
    this.match = new Set();
}

module.exports.Match.prototype.addMatch = function (match) {
    this.match.add(match);
}

module.exports.Match.prototype.hasPlayed = function (match) {
    if(this.match.has(match)){
        return true;
    }
    else{
        return false;
    }
}
