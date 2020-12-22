let categories = [];
const NUM_CATEGORIES = 100;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
    let ids = [];
    categories.forEach(cat => ids.push(cat.id));

    return ids;
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
    return categories.find(cat => cat.id === catId);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable($board) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < 5; i++) {
            $("tbody", $board).append("<tr>");
        }

        let domTable = $board[0];
        let categoriesDone = 0;


        categories.every(async (category, i) => {
            let response = await axios.get("http://jservice.io/api/clues", {
                params: {
                    category: category.id
                }
            }).catch(err => {
                reject(err);
            });

            $("thead tr", $board).append(`<th data-id="${category.id}">${capitalizeTitle(category.title)}</th>`);

            //Get random clues 
            let clues = getRandomArrayEntries(response.data, 5);

            clues.sort((a, b) => {
                return a.value - b.value;
            });

            category.clues = clues;



            clues.forEach((clue, index) => {
                //Validate clue
                if (clue.value == null) {
                    if (index == 0)
                        clue.value = 200;
                    else
                        clue.value = clues[index - -1] + 200;
                }

                clue.index = index;

                $(domTable.rows[index + 1]).append(`
                <td class="game-cell" data-clueID="${clue.id}">
                    <h4 class="cell value"> $${clue.value}</h4>
                    <div class="cell question" style="display: none">${clue.question}</div>
                    <h5 class="cell answer" style="display: none">${clue.answer}</h5>
                </td>`);
            });

            categoriesDone++;
            if (categoriesDone >= categories.length) {
                resolve($board);
            }
        });
    });
}

function getRandomArrayEntries(array, numEntries) {
    let outArray = [];
    for (let i = 0; i < numEntries; i++) {
        outArray.push(array.splice(Math.random() * array.length | 0, 1)[0]);
    }
    return outArray;
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(e) {
    let $cell;

    if ($(e.target).hasClass("game-cell"))
        $cell = $(e.target);
    else
        $cell = $(e.target).parents(".game-cell");

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
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

    $(".view").hide();
    $("#loadingView").show();
}

function showSplashView() {
    $(".view").hide();
    $("#splashView").show();
}

function showGameView($board) {
    $(".view").hide();
    $("#gameView").prepend($board);
    $("#gameView").show();
}

async function getCategories() {
    let response = await axios.get("http://jservice.io/api/categories", {
        params: {
            count: NUM_CATEGORIES,
            offset: Math.random() * 10000 | 0
        }
    });

    return response.data;
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    let buffer = await getCategories();

    //Grab random 6 from the buffer array, removing it each step so we don't duplicate them
    categories = getRandomArrayEntries(buffer, 6);

    let $board = createGameBoard(categories);
    await fillTable($board);

    showGameView($board);
}

function createGameBoard() {
    $("table").remove();

    let $board = $(`
    <table id="game">
    <thead><tr></tr></thead>
    <tbody>
    </tbody>
    </table>
    `);

    return $board;
}

/**Capitalizes my titles properly. */
function capitalizeTitle(str) {
    let ar = str.split(" ");
    const wordExceptions = ["the", "in", "as", "per", "a", "of", "an", "for", "nor", "or", "yet", "so", "at", "from", "on", "to", "with", "without"]
    ar.forEach((word, i) => {
        if (i == 0 || !wordExceptions.includes(word))
            ar[i] = word.charAt(0).toUpperCase() + word.substring(1);
    });
    return ar.join(" ");
}

/** On click of start / restart button, set up game. */

/** On page load, add event handler for clicking clues */

$(() => {
    $("#btnStart, #btnRestart").click(e => {
        setupAndStart();
    })

    $("#gameView").on('click', ".game-cell", handleClick);
})