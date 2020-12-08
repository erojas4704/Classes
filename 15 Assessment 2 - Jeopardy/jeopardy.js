// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {

}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {

}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {

}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    let response = await axios.get("http://jservice.io/api/categories", {
        params: {
            count: 100,
            offset: Math.random()*10000 | 0
        }
    });

    let buffer = response.data;
    let categories = [];

    //Grab random 6 from the buffer array.
    for (let i = 0; i < 6; i++) {
        let index = Math.random() * buffer.length | 0;
        console.log(buffer, buffer[index], index);

        categories.push(buffer.splice(index, 1)[0]);
    }

    let $game = await createGameBoard(categories)
    .catch(err =>{ 
        alert(err);
    });


    if($game)
        $game.show();
    else
        ("#splash").show();
}

const createGameBoard = async categories => {
    return new Promise((resolve, reject) => {
        $("table").remove();

        let $board = $(`<table style="display: none" id="game">
        <thead>
            <tr></tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    `);

        $(document.body).append($board);


        for (let i = 0; i < 5; i++) {
            $("#game tbody ").append("<tr>");
        }

        let domTable = document.querySelector("#game");
        let categoriesDone = 0;


        categories.every(async (cat, i) => {
            let response = await axios.get("http://jservice.io/api/clues", {
                params: {
                    category: cat.id
                }
            }).catch(err => {
                reject(err);
            });

            $("#game thead tr").append(`<th>${cat.title}</th>`);


            let clues = response.data;

            clues.forEach((clue, index) => {
                $(domTable.rows[index + 1]).append(`
            <td class="game-cell">
                <div class="cell value"> ${i} $${clue.value}</div>
                <div class="cell question" style="display: none">${clue.question}</div>
                <div class="cell answer" style="display: none">${clue.answer}</div>
            </td>`);
            });

            categoriesDone++;
            if (categoriesDone >= categories.length) {
                resolve($board);
            }
        });
    });
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */



// TODO

$(() => {
    setupAndStart();

    //I add this here because I'm not allowed to change the HTML
    $(document.body).on('click', ".game-cell", e => {
        let $cell;

        if ($(e.target).hasClass("game-cell"))
            $cell = $(e.target);
        else
            $cell = $(e.target).parents(".game-cell");

        console.log($(e.target));
        let $value = $(".value", $cell);
        let $question = $(".question", $cell);
        let $answer = $(".answer", $cell);

        //Reveal the question or whatever
        //Ugly but I wanna get this done fast
        if ($value.is(":visible")) {
            $question.show();
            $(".cell", $cell).not($question).hide();
        } else if ($question.is(":visible")) {
            $answer.show();
            $(".cell", $cell).not($answer).hide();
        }
    });
})