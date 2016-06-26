const Game = require('./game.js');

module.exports = function(robot) {
  'use strict';

  // the game 'singleton'. yuck.
  var game = new Game();
  var roomName = 'AliasHunter';
  //var roomName = 'Shell';

  robot.respond(/new codenames game/i, function(msg) {
    if (msg.envelope.room !== roomName) {
      return msg.send('Please join #' + roomName + '.');
    }
    if (game.inProgress()) {
      return msg.send('There is already a game in progress. Either finish the game or end it ' +
          'by typing \'' + robot.name + ' end codenames game\'.');
    }

    if (!game.inProgress()) {
      game.newGame();
      msg.send('Who\'s in? Respond with :hand:. When everyone\'s in, type \'' + robot.name + ' everyone\'s in\'');
    }
  });

  robot.respond(/end codenames game/i, function(msg) {
    if (msg.envelope.room !== roomName) {
      msg.send('Please join #codenames to end a game');
      return;
    }

    game.end();
  });

  robot.hear(/^:hand:$/i, function(msg) {
    if (msg.envelope.room === roomName) {
      try {
        game.addPlayer(msg.message.user.name);
        msg.send(['Adding', msg.message.user.name, 'to the game...'].join(' '));
      } catch (e) {
        msg.send(e);
      }
    }
  });

  robot.respond(/(who's|who is) playing/i, function(msg) {
    var response = '';
    if (msg.envelope.room === roomName) {
      if (game.inProgress()) {
        response += 'Here\'s a list of who\'s playing:';
        Object.keys(game.players).forEach(function(playerHandle) {
          response += '\n' + playerHandle;
        });
        msg.send(response);
      }
      else {
        msg.send('There\'s no game in progress right now! To start a game, type \'' + robot.name + ' new codenames game\'');
      }
    }
  });

  robot.respond(/everyone's in/i, function(msg) {
    try {
      game.start(msg, robot);
    } catch (e) {
      msg.send(e);
    }
  });
};

