const DECK_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
const CARDS_URL = 'https://deckofcardsapi.com/';
const DRAW_CARD = ''
let deckData;

function getNewDeck() {
    return new Promise((resolve, reject) => {
        axios.get(DECK_URL)
            .then(resp => {
                console.log(resp.data);
                resolve(resp.data);

            }).catch(err => {
                reject(err);
            });
    });
}

function drawSingleCard(deckData) {
    return axios.get(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=1`);
}

function runCardTests() {
    getNewDeck()
        .then(resp => {
            deckData = resp;
            return drawSingleCard(deckData);
        })
        .then(resp => {
            console.log(resp);
            let card = resp.data.cards[0];
            renderText(`You drew a ${card.value} of ${card.suit}.`)
            return drawSingleCard(deckData);
        }).then(resp => {
            console.log(resp);
            let card = resp.data.cards[0];
            renderText(`You drew a ${card.value} of ${card.suit}.`)
        });
}

function renderText(text) {
    document.querySelector("#text").innerHTML += `\n<div>${text}</div>`;
}

getNewDeck().then(resp => {
    deckData = resp;
    $("#btn-draw").prop("disabled", false);
})

$("#btn-draw").click(e => {
    drawSingleCard(deckData).then(cardData => {
        if(!cardData.data.success){
            renderText("oh, dear, you've run out of cards.")
        }
        let card = cardData.data.cards[0];
        let rand = Math.random() * 180;
        let $newCard = $(`<img class="card" src="${card.image}"></img>`);

        $("#card-display").append($newCard);
        $newCard.css("transform", `rotate(${rand}deg)`);
    });
});

$("#btn-draw").prop("disabled", true);