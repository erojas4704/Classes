/** Textual markov chain generator */


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
    this.words.forEach( (word, i) => {
      let next;
      if(i < this.words.length - 1){
        next = this.words[i + 1];
      }

      if(!this.chains[word]){
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
    for(let i = 0; i < numWords; i ++){
      let index = this.chains.length;
      text += this.getRandomPair();
    }
    return text;
  }

  getRandomPair(){
    let keys = Object.keys(this.chains);
    let index = Math.floor(Math.random() * keys.length);

    let word = keys[index];
    let nextIndex = Math.floor(this.chains[word].length * Math.random() );
    let nextWord = this.chains[word][nextIndex];

    return ` ${word}${nextWord ? ` ${nextWord}` : "."}`;
  }
}



let m = new MarkovMachine("the cat in the hat is in the hat");
console.log(m.chains);
console.log(m.makeText())