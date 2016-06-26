module.exports = (opt) => {
  'use strict';
  this.id = opt.id;
  this.name = opt.name;
  this.players = [];
  this.addPlayer = function(player) { this.players.push(player); };
  this.getTeamSize = function() { return this.players.length; };
  this.selectSpymaster = function(player) {
    if (player) {
      this.spymaster = player;
    }
    else {
      // Choose a random spymaster
      this.spymaster = this.players[Math.floor(Math.random() * this.getTeamSize())];
    }
    if (!this.spymaster) { throw 'No spymaster for this team!'; }
    this.spymaster.isSpymaster = true;
  };
};
