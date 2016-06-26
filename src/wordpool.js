const Colors = require('./constants/colors.js');
const Word = require('./word.js');

module.exports = () => {
  'use strict';
  this.getWordsByColor = function(color) {
    return this.words.filter(function(word) {
      return word.color === color;
    });
  };

  this.generateWords = function() {
    var totalRed = 9;
    var totalBlue = 8;
    var totalBlack = 1;
    var numRedRemaining = totalRed;
    var numBlueRemaining = totalBlue;
    var numBlackRemaining = totalBlack;
    var wordChoices = [
      'cross',
      'strike',
      'kangaroo',
      'jack',
      'temple',
      'key',
      'drill',
      'tooth',
      'berlin',
      'atlantis',
      'pole',
      'paper',
      'chair',
      'hawk',
      'calf',
      'hero',
      'mandarin',
      'amazon',
      'glove',
      'well',
      // Here's where I'm adding random words from https://github.com/first20hours/google-10000-english/blob/master/20k.txt
      'video',
      'map',
      'hotel',
      'family',
      'website'
    ];
    var i;
    var numChoices;
    var words = [];
    var currWord;
    var colorRand;
    var color;

    // Pick color words
    for (i = 0, numChoices = wordChoices.length; i < numChoices; ++i) {
      currWord = wordChoices[i];
      colorRand = Math.floor(Math.random() * numChoices);

      if (colorRand < totalBlack && numBlackRemaining > 0) {
        // Assassin word
        --numBlackRemaining;
        color = Colors.COLOR_BLACK;
      } else if (colorRand < totalBlack + totalRed && numRedRemaining > 0) {
        // Red word
        --numRedRemaining;
        color = Colors.COLOR_RED;
      } else if (colorRand < totalBlack + totalRed + totalBlue && numBlueRemaining > 0) {
        // Blue word
        --numBlueRemaining;
        color = Colors.COLOR_BLUE;
      } else {
        // Neutral word
        color = Colors.COLOR_BROWN;
      }

      words.push(new Word({
        word: currWord,
        color: color
      }));
    }

    this.words = words;
  };

  this.getAllWords = function() {
    return this.words;
  };

  this.getRedWords = function() {
    return this.getWordsByColor(Colors.COLOR_RED);
  };

  this.getBlueWords = function() {
    return this.getWordsByColor(Colors.COLOR_BLUE);
  };

  this.getBlackWords = function() {
    return this.getWordsByColor(Colors.COLOR_BLACK);
  };

  this.getBrownWords = function() {
    return this.getWordsByColor(Colors.COLOR_BROWN);
  };
};
