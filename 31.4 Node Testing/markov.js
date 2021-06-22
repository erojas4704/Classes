/** Textual markov chain generator */
const fs = require('fs');


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    // TODO
    this.chains = {};
    this.words.forEach((word, i) => {
      let next;
      if (i < this.words.length - 1) {
        next = this.words[i + 1];
      }

      if (!this.chains[word]) {
        this.chains[word] = [];
      }

      //if(!this.chains[word].includes(next))
      this.chains[word].push(next);
    });
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    // TODO
    let text = "";
    for (let i = 0; i < numWords; i++) {
      let next = this.getNext();
      if (!next) {
        next = ".";
      } else if (i != 0) {
        next = " " + next;
      }
      text += next;
    }
    return text;
  }

  getNext() {
    if (!this.currKey) {
      this.currKey = this.getRandomKey()
      return this.currKey;
    }


    let key = this.currKey;
    this.currKey = this.getRandomWord(key);
    return this.currKey;
  }

  getRandomWord(key) {
    let index = Math.floor(this.chains[key].length * Math.random());
    let word = this.chains[key][index];

    return word;
  }

  getRandomKey() {
    let keys = Object.keys(this.chains);
    let index = Math.floor(Math.random() * keys.length);
    let key = keys[index];
    return key;
  }

}

module.exports = {
  MarkovMachine
}