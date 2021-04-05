$( () => {
    function onGuessForm(e){
        e.preventDefault();

        let guess = $("#txt_guess").val();

        sendGuessToServer(guess)
        .then(response => {
            readout( parseResult(response.data.result))
            updateScore(response.data.score);
        });
        
        resetForm();
    }

    function updateScore(score){
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

    $("#form_guess").submit(onGuessForm);
})