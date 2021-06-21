const DECK_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
const CARDS_URL = 'https://deckofcardsapi.com/';
const DRAW_CARD = ''
let deckData;

async function getNewDeck() {
    let resp = await axios.get(DECK_URL);
    return resp.data;
}

async function drawSingleCard(deckData) {
    let resp = await axios.get(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=1`);
    return resp.data.cards[0];
}

async function runCardTests() {
    deckData = await getNewDeck();
    let cards = {};
    cards.c1 = await drawSingleCard(deckData);
    cards.c2 = await drawSingleCard(deckData);
    cards.c3 = await drawSingleCard(deckData);
    renderCardText(cards.c1);
    renderCardText(cards.c2);
    renderCardText(cards.c3);
}

function renderCardText(card) {
    renderText(`You drew a ${card.value} of ${card.suit}.`)
}

function renderText(text) {
    document.querySelector("#text").innerHTML += `\n<div>${text}</div>`;
}

async function setup() {
    deckData = await getNewDeck();
    $("#btn-draw").prop("disabled", false);
}

$("#btn-draw").click(async e => {
    try {
        let card = await drawSingleCard(deckData);
        let rand = Math.random() * 180;
        let $newCard = $(`<img class="card" src="${card.image}"></img>`);

        $("#card-display").append($newCard);
        $newCard.css("transform", `rotate(${rand}deg)`);
    } catch (e) {
        console.log(e);
        renderText("oh, dear, you've run out of cards.")
    }
});

$("#btn-draw").prop("disabled", true);
setup();