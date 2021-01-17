const gameContainer = document.getElementById("game");

///GAME SETTINGS
const NUMBER_OF_COLORS = 5;
const CARDS_TO_MATCH = 2;

var colors = [];

for(var i = 0; i < NUMBER_OF_COLORS; i ++){
  var r = ("00" + (Math.random() * 256).toString(16)).substr(-2);
  var g = ("00" + (Math.random() * 256).toString(16)).substr(-2);
  var b = ("00" + (Math.random() * 256).toString(16)).substr(-2);

  for(var c = 0; c < CARDS_TO_MATCH; c ++){
    colors.push(`#${r+g+b}`);
  }
}


var score = 0;
var bestScore = undefined;
let tempFaceUp = [];
var cheater = false;


function startGame(){

  score = 0;
  //Clean up anything that's there
  for(let card of gameContainer.querySelectorAll("div"))
  {
    card.remove();
  };

  cheater = localStorage.cheater;

  if(localStorage.bestScore != undefined)
    bestScore = Number(localStorage.bestScore);
  else
    bestScore = Infinity;

  if(bestScore == undefined || bestScore == Infinity){
    document.querySelector("#container-best").style.display = "none";
  }else{
    document.querySelector("#container-best").style.display = "block";
  }

  document.querySelector("#splash").style.display = "none";
  document.querySelector("#screen-game").style.display = "block";
  document.querySelector("#game-over").style.display = "none";
  document.querySelector("#best").innerText = bestScore;
  
  let shuffledColors = shuffle(colors); 
  createDivsForColors(shuffledColors);
}

function endGame(){
  var newRecord = false;
  if(score < bestScore){
    localStorage.bestScore = score;
    newRecord = true;
  }
  document.querySelector("#splash").style.display = "none";
  document.querySelector("#game-over").style.display = "block";
  document.querySelector("#screen-game").style.display = "none";

  document.querySelector("#message-win").innerText = `You won with ${score} attempts! Your best is ${localStorage.bestScore}.`

  if(score == 0){
    document.querySelector("#message-win").innerText = `\nWowwie! You got a perfect score!`;
  }
  
  if(score < 0 || localStorage.cheater == "true"){
    localStorage.cheater = "true";
    document.querySelector("#win-contigent").innerText = "A cheater is you.";
  }

  if(newRecord){
    document.querySelector("#message-win").innerText += `\nYou've achieved a new record!`;
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if(isCardShown(event.target) || tempFaceUp.length >= CARDS_TO_MATCH){
    return;
  }

  tempFaceUp.push(event.target);
  showCard(event.target);



  if(tempFaceUp.length >= CARDS_TO_MATCH){

    if(hasFoundMatch()){
      tempFaceUp = [];

      if(gameIsWon()){
        endGame();
      }
      
    }
    else{
      score ++;
      document.querySelector("#score").innerText = score;

      setTimeout(() => {
        shown = 0;
        tempFaceUp.forEach( card => {
          hideCard(card);
        });
        tempFaceUp = [];
        }, 1000);
      }
  }
}

function gameIsWon(){
  if(tempFaceUp.length > 0){
    return false;
  }
  
  for(let card of gameContainer.querySelectorAll("div"))
  {
    if(!isCardShown(card)){
      return false;
    }
  };

  return true;
}

function hasFoundMatch(){
  let lastCard;
  var failed; 

  tempFaceUp.forEach(card => {
    if(lastCard != undefined){
      if(lastCard.className != card.className){
        failed = true;
        return false;
      }
    }

    lastCard = card;
  });

  return !failed;
}

function isCardShown(cardElement){
  return cardElement.getAttribute("data-shown") == "true";
  //return cardElement.style.backgroundColor === cardElement.className;
}

function showCard(cardElement){
  cardElement.setAttribute("data-shown", "true");
  cardElement.style.backgroundColor = cardElement.className;
}

function hideCard(cardElement){
  cardElement.setAttribute("data-shown", "false");
  cardElement.style.backgroundColor = "";
}