
class Player {
    constructor(color, name, index) {
        this.color = color;
        this.name = name;
        this.index = index;
    }
}


class Game {

    constructor(width, height, players) {
        this.width = width;
        this.height = height;
        this.table = this.createBoardElement();
        this.tokensInPlay = 0;
        this.numSlots = 0;
        this.whoseTurn = -1;
        this.board = [];
        this.players = players;

        document.getElementById('container_board').append(this.table);

        this.makeBoard();
        this.renderBoard();

        document.getElementById('overlay').style.width = this.table.offsetWidth + "px";
        document.getElementById('overlay').style.height = this.table.offsetHeight + "px";
    }

    makeBoard() {
        this.board = new Array(this.height).fill(undefined).map(() => new Array(this.width).fill(undefined));
        this.tokensInPlay = 0;
        this.numSlots = this.width * this.height;
    }

    renderBoard() {
        this.table.innerHTML = "";

        this.board.forEach((row, rowIndex) => {
            let tableRow = document.createElement('tr');
            tableRow.id = `row-${rowIndex}`;

            row.forEach((cell, colIndex) => {
                let tableCell = document.createElement('div');
                tableCell.id = `cell-${rowIndex}-${colIndex}`;
                tableCell.classList.add(`game-cell`);
                tableCell.classList.add(`color-${cell}`);
                tableCell.classList.add(`col-${colIndex}`);
                tableCell.setAttribute('data-row', rowIndex);
                tableCell.setAttribute('data-col', colIndex);

                let container = document.createElement('td');
                container.classList.add("decoration-cell");
                container.appendChild(tableCell);
                tableRow.appendChild(container);

            });

            this.table.appendChild(tableRow);
        });

        //Loop again to place cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] != undefined) {
                    this.placeToken(x, y, this.board[y][x]);
                }
            }
        }
    }

    createBoardElement() {
        let table = document.createElement('table');

        table.addEventListener('mouseover', e => {
            var targetCell = e.target;

            if (!targetCell.classList.contains('game-cell')) {
                //Todo simplify to a resolveGameCell(cell)
                if (targetCell != table)
                    targetCell = targetCell.querySelector(".game-cell");
            }

            if (!targetCell) return;


            var column = targetCell.getAttribute('data-col');

            if (column == null) return;

            //Clear everything 
            document.querySelectorAll(`.game-cell`).forEach(
                e => { e.classList.remove("highlight") }
            );

            //Show drop indicator.
            document.querySelectorAll(`.col-${column}`).forEach(
                e => { e.classList.add("highlight") }
            );

        });

        table.addEventListener('click', e => {
            var targetCell = e.target;

            if (this.whoseTurn == -1) {
                console.log("Error. Not my turn!");
                return;
            }


            let player = this.players[this.whoseTurn];

            if (!targetCell.classList.contains('game-cell')) {

                //Todo simplify to a resolveGameCell(cell)
                if (targetCell != table)
                    targetCell = targetCell.querySelector(".game-cell");

                if (!targetCell.classList.contains('game-cell')) {

                    console.log("Error. Did not click a game cell.");
                    //TODO get nearest cell.
                    return;
                }
            }

            let x = Number(targetCell.getAttribute('data-col'));
            let y = Number(targetCell.getAttribute('data-row'));

            //Find the bottommost cell we can put our piece on.
            while (y != this.board.length - 1) {

                //If the next cell has something on it, then break the loop.
                if (this.board[y + 1][x] != undefined) {
                    break;
                }
                y++
            };

            if (this.board[y][x] != undefined) {

                //Go up and check if there's an empty spot
                while (y >= 0) {
                    if (this.board[y][x] == undefined) {
                        break;
                    }
                    if (y == 0 && this.board[y][x] != undefined) {
                        console.log("Error. Column is full.");
                        return;
                    }
                    y--;
                }
            }

            this.placeToken(x, y, player);

            //Check win condition
            let winningPieces = this.isWinningMove(y, x, player);
            let lastTurn = this.whoseTurn;

            //Cycle through local players
            this.whoseTurn++;
            this.whoseTurn %= this.players.length;

            if (winningPieces) {
                this.endGame(winningPieces, player);
            }
        });

        return table;
    };

    placeToken(x, y, player) {
        let cell = this.getCell(y, x);
        let newToken = document.createElement('div');
        newToken.classList.add('token');
        newToken.classList.add(`token-${player.color}`);

        //Ugly workaround so that it actually animates
        setTimeout(() => { newToken.style.top = '0px' }, 15);
        cell.append(newToken);
        cell.classList.add(`color-${player.color}`);

        this.board[y][x] = player;
        this.tokensInPlay++;
        if (this.tokensInPlay >= this.numSlots) {
            //draw
            this.endGame();
        }
    }

    getCell(row, column) {
        return this.table.querySelector(`#cell-${row}-${column}`);
    }

    //recursive for getting number of matches in a given direction.
    traverse(y, x, yDelta, xDelta, player, matches = []) {
        //Return how many matches
        y += yDelta;
        x += xDelta;

        //Make sure we're not checking out of bounds.
        if (y >= this.board.length || y < 0 || x >= this.board[y].length || x < 0) {
            return matches;
        }

        if (this.board[y][x] == player) {
            matches.push({ x, y });
            return this.traverse(y, x, yDelta, xDelta, player, matches);
        }

        return matches;
    }

    isWinningMove(y, x, player) {
        //Check all 8 directions from the origin point for 4 consecutive matches
        let horizontal = [], vertical = [], diagonal = [], diagonal2 = [];

        horizontal.push(...this.traverse(y, x, 0, 1, player)); //Right
        horizontal.push(...this.traverse(y, x, 0, -1, player)); //Left
        vertical.push(...this.traverse(y, x, 1, 0, player)); //Up
        vertical.push(...this.traverse(y, x, -1, 0, player)); //Down

        diagonal.push(...this.traverse(y, x, 1, 1, player)); //Up Right
        diagonal.push(...this.traverse(y, x, -1, -1, player)); //Down Left
        diagonal2.push(...this.traverse(y, x, 1, -1, player)); //Up Left
        diagonal2.push(...this.traverse(y, x, -1, 1, player)); //Down Right

        //Return the longest array
        let longest = horizontal;

        [horizontal, vertical, diagonal, diagonal2].forEach(a => {
            if (a.length > longest.length) {
                longest = a;
            }
        });

        //Make sure it includes the origin too.
        longest.push({ x, y });

        if (longest.length < 4) {
            //If it's not long enough, don't return anything.
            return;
        }

        //If any value is more than 4, we have a victory.
        return longest;
    }

    endGame(winningPieces, winner) {
        //Find all matches of 4 and highlight them

        if (winningPieces == undefined) {
            //The game is a draw
            document.getElementById("endgame").innerText = `The game is a draw.`;

            promptReplay(isHost);
            whoseTurn = -1;
            return;
        }

        winningPieces.forEach(vec2 => {
            let cell = this.getCell(vec2.y, vec2.x);
            cell.querySelector('.token').classList.add("shine");
            cell.classList.add("glow");
        });

        document.getElementById("endgame").innerText = `${winner.name} has won the game!`;

        this.whoseTurn = -1;

        //Show a play again button
        this.promptReplay();
    }

    promptReplay() {
        document.getElementById("overlay_replay").style.display = "";

        document.getElementById("btn_replox").disabled = false;
        document.getElementById("wait_for_host").style.display = "none";

        document.getElementById("btn_replox").onclick = e => {
            document.getElementById("overlay_replay").style.display = "none";
            //Send 
            //Drop all the shapes
            resetGame();
        }
    }

    setRandomTurn() {
        this.whoseTurn = Math.floor(Math.random() * this.players.length);
    }

    resetGame() {
        document.getElementById("overlay_replay").style.display = "none";
        document.querySelectorAll(".token").forEach(t => {
            t.style.top = "700px";
        });


        setTimeout(() => {
            document.querySelectorAll(".token").forEach(t => {
                t.remove();
            });

            makeBoard();
            renderBoard();

            whoseTurn = Math.floor(Math.random() * this.players.length);

        }, 600);
    }
}

function pregame() {
    showScreen("screen_pregame");
    populatePregameMenu();


    document.getElementById('numplayers').onchange = () => {
        populatePregameMenu();
    }

    document.getElementById('player_form_submit').onclick = e => {
        e.preventDefault();
        //Register all players

        let players = [];
        let playerForm = document.getElementById("playerform");
        let numPlayers = playerForm.players.value;

        //TODO make sure it's done in order from top to bottom
        //Get all players from the form
        playerForm.querySelectorAll('.player-unit').forEach( (element, index) => {
            //If it's not visible, skip and continue the loop.
            if (element.offsetParent === null) return true;


            let name = element.querySelector(".player-name").value;
            let color = element.querySelector(".player-color").value;
            players.push(new Player(color, name, index));
            index ++;
        });

        startGame(players);
    }
}

function populatePregameMenu() {
    let playerForm = document.getElementById("playerform");
    let numPlayers = playerForm.players.value;
    let template = playerForm.querySelector("#player_0");

    //Clear all pregame nodes
    playerForm.querySelectorAll('.player-unit').forEach(element => {
        if (element.id != "player_0") {
            element.remove();
        }
    });

    for (var i = 0; i < numPlayers; i++) {
        let playerNumber = i + 1;
        let newNode = template.cloneNode(true);
        newNode.id = "player_" + playerNumber;
        newNode.style.display = "";

        newNode.querySelector(".player-color").name = "color-" + playerNumber;
        newNode.querySelector(".player-name").name = "name-" + playerNumber;
        newNode.querySelector(".player-name").value = "Player " + playerNumber;
        newNode.querySelector(".player-label").innerText = newNode.querySelector(".player-label").innerText.replace("%n", playerNumber);
        playerForm.append(newNode);
    }


    //Make all color choices unique
    playerForm.querySelectorAll('.player-unit').forEach(pNode => {
        let colorNode = pNode.querySelector(".player-color");
        let color = colorNode.value;
        let used = false;
        let usedColors = [];

        //TODO doesn't work

        playerForm.querySelectorAll(".player-unit").forEach(n => {
            if (n != pNode) {
                if (n.querySelector(".player-color").value == color) {
                    used = true;
                }

                usedColors.push(n.querySelector(".player-color").value);
            }
        });

        if (used) {
            for (let i = 0; i < colorNode.options.length; i++) {
                let option = colorNode.options[i].value;
                if (!usedColors.includes(option)) {
                    if (!color != option) {
                        color = option;
                        break;
                    }
                }
            }
        }

        colorNode.value = color;
    });
}

function startGame(players) {
    showScreen("screen_game");
    let game = new Game(7, 6, players);

    game.setRandomTurn();
    return game;
}

function showScreen(screenID) {
    document.querySelectorAll(".screen").forEach(s => {
        if (s.id != screenID) {
            s.style.display = "none";
        } else {
            s.style.display = "";
        }
    });
}