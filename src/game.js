const States = require('./constants/states.js');
const Colors = require('./constants/colors.js');
const Team = require('./team.js');
const Player = require('./player.js');
const WordPool = require('./wordpool.js');

const Game = function() {
  'use strict';

  this.players = {};

  this.newGame = function() {
    if (this.state !== States.STATE_INACTIVE) {
      throw 'Couldn\'t start a new game because there is already a game in progress.';
    }

    this.state = States.STATE_PREGAME;
    this.players = {};
  };

  this.start = function(msg, robot) {
    if (this.state !== States.STATE_PREGAME) {
      throw 'Something went wrong, expected state ' + States.STATE_PREGAME + ' but got state ' + this.state;
    }
    if (Object.keys(this.players).length < 2) {
      throw new Error('You can\'t play with less than two players!');
    }

    this.doSetup(msg, robot);

    //while (this.inProgress()) {
    //}
  };

  this.doSetup = function(msg, robot) {
    var that = this;

    this.generateTeams(function(teams) {
      var team;
      msg.send('The teams are...');

      team = teams[0];
      msg.send(team.name);
      msg.send(team.players.map(function(teamPlayer) {
        return teamPlayer.handle + (teamPlayer.isSpymaster ? ' (spymaster)' : '');
      }).join('\n') + '\n');

      team = teams[1];
      msg.send(team.name);
      msg.send(team.players.map(function(teamPlayer) { return teamPlayer.handle; }).join('\n'));
    });

    this.generateWordPool(function(wordPool) {
      var words = wordPool.getAllWords();
      var generalResponse = 'The words are...\n' + words.map(function(word) {
        return word.word;
      }).join('\n');
      var extractWord = function(wordObj) {
        return wordObj.word;
      };

      var spymasterMessage = 'You are the spymaster! Here are your words\n';
      var redList = wordPool.getRedWords().map(extractWord);
      var blueList = wordPool.getBlueWords().map(extractWord);
      var brownList = wordPool.getBrownWords().map(extractWord);
      var blackList = wordPool.getBlackWords().map(extractWord);
      var redWords = 'RED WORDS:\n' + redList.join('\n');
      var blueWords = 'BLUE WORDS:\n' + blueList.join('\n');
      var brownWords = 'BROWN WORDS:\n' + brownList.join('\n');
      var blackWords = 'BLACK WORDS:\n' + blackList.join('\n');

      var redSpymasterMsg = [spymasterMessage, redWords, blueWords, brownWords, blackWords].join('\n\n');
      var blueSpymasterMsg = [spymasterMessage, blueWords, redWords, brownWords, blackWords].join('\n\n');

      // Normal spies
      msg.send(generalResponse);

      // Red spymaster
      robot.messageRoom(that.teams[Colors.COLOR_RED].spymaster.handle, redSpymasterMsg);

      // Blue spymaster
      robot.messageRoom(that.teams[Colors.COLOR_RED].spymaster.handle, blueSpymasterMsg);
    });
  };

  this.end = function() {
    this.state = States.STATE_INACTIVE;
  };

  this.inProgress = function() {
    return this.state !== States.STATE_INACTIVE;
  };

  this.nextTurn = function() {
  };

  this.generateTeams = function(cb) {
    var redTeam = new Team({ id: 1, color: Colors.COLOR_RED, name: 'Red Team' });
    var blueTeam = new Team({ id: 2, color: Colors.COLOR_BLUE, name: 'Blue Team' });
    this.teams = {};
    this.teams[Colors.COLOR_RED] = redTeam;
    this.teams[Colors.COLOR_BLUE] = blueTeam;

    // Randomly generate teams
    var playerHandles = Object.keys(this.players);
    var numPlayers = playerHandles.length;
    var maxTeamSize = numPlayers / 2;
    var i;
    var rand;
    var player;

    for (i = 0; i < numPlayers; ++i) {
      player = this.players[playerHandles[i]];
      rand = Math.random();

      // Randomly assign player to a team, unless that team is maxed out with players
      if (rand < 0.5 && redTeam.getTeamSize() < maxTeamSize) {
        redTeam.addPlayer(player);
      } else {
        blueTeam.addPlayer(player);
      }
    }

    redTeam.selectSpymaster();
    blueTeam.selectSpymaster();

    cb(this.teams);
  };

  this.generateWordPool = function(cb) {
    this.wordPool = new WordPool();
    this.wordPool.generateWords();
    cb(this.wordPool);
  };

  this.addPlayer = function(handle) {
    if (this.state === States.STATE_PREGAME) {
      this.players[handle] = new Player({
        handle: handle
      });
    } else {
      throw 'Couldn\'t add player because state of game is ' + this.state;
    }
  };

  this.getColorName = function(color) {
    switch (color) {
      case Colors.COLOR_BLUE:
        return 'Blue';
      case Colors.COLOR_RED:
        return 'Red';
      case Colors.COLOR_BROWN:
        return 'Brown';
      case Colors.COLOR_BLACK:
        return 'Black';
    }
  };

  this.getPlayerByHandle = function(handle) {
    return this.players[handle];
  };

  this.state = States.STATE_INACTIVE;
};

module.exports = Game;
