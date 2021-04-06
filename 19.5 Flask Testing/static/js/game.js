$( () => {
    let time = 60;
    let playable = false;
    let isOver = false;
    let score;

    function onGuessForm(e){
        e.preventDefault();

        if(!playable){
            readout("The game is over. You have no more time left.");
            return; 
        }

        let guess = $("#txt_guess").val();

        sendGuessToServer(guess)
        .then(response => {
            readout( parseResult(response.data.result))
            updateScore(response.data.score);

            if(response.data.state == 3){
                endgame();
                time = 0;
            }
        });
        
        resetForm();
    }

    function updateScore(score){
        score = score;
        $("#score").text(`Score: ${score}`)
    }

    function parseResult(response){
        switch(response){
            case "not-on-board":
                return "This word is not on the board, mang."
            case "ok":
                return "Nice work buddy";
            case "not-word":
                return "Ayo das not a word papi";
        }

        return response;
    }

    function resetForm(){
        $("#txt_guess").val("");
    }

    function readout(text){
        $("#readout").text(text);
    }

    function sendGuessToServer(guess){
        return new Promise( (resolve, reject) => {
            axios.get('/guess', {
                params: {guess}
            })
            .then( response => {
                console.log(response)
                resolve(response);
            })
            .catch ( err => {
                console.error(`Error With the thing: ${err}`)
                reject(err);
            });
        })
    }

    function tick(){
        time --;

        if(time < 0){
            time = 0;
            playable = false;
            endGame();
        }


        $("#timer").text(`Time: ${time}`);
    }

    function endGame(){
        if(isOver) return;
        isOver = true;
        window.location.href = "/endgame";

    }

    function showGame(){
        $("#game").show();
    }

    async function start(){
        //GAME START!
        let response = await axios.get('/expiration');
        let expiration = new Date(response.data.expires);
        let now = new Date();

        showGame();
        
        console.log(now, expiration);

        time = Math.round((expiration - now) / 1000)
        console.log("TIME IS ", time);
        
        $("#timer").text(`Time: ${time}`);
        
        console.log(time);

        playable = true;
        setInterval(tick, 1000);
    }

    $("#form_guess").submit(onGuessForm);
    start();
})