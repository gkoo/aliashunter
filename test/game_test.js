/* global describe it */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const Game = require('../src/game');
const States = require('../src/constants/states');

describe('Game', function() {
  'use strict';

  it('initializes to an inactive state', () => {
    var game = new Game();
    assert(game.state === States.STATE_INACTIVE);
  });

  it('goes into pre-game state when you start a game', () => {
    var game = new Game();
    game.newGame();
    assert(game.state === States.STATE_PREGAME);
  });

  it('will not start without at least two players', () => {
    var game = new Game();
    game.newGame();
    expect(game.start.bind(game)).to.throw('You can\'t play with less than two players!');
  });
});
