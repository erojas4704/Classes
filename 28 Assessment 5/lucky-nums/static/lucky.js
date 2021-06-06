/** processForm: get data from form and make AJAX call to our API. */

async function processForm(evt) {
    evt.preventDefault();
    resetValues();

    resp = await axios.post("/api/get-lucky-num", {
        name: $("#name").val(),
        year: $("#year").val(),
        email: $("#email").val(),
        color: $("#color").val()
    });

    console.log(resp);
    handleResponse(resp.data);
}

/** resetValues: clear all the dumb shit we put */
function resetValues(){
    $(`#name-err`).text("");
    $(`#year-err`).text("");
    $(`#email-err`).text("");
    $(`#color-err`).text("");
}

/** handleResponse: deal with response from our lucky-num API. */

function handleResponse(resp) {
    if(resp.errors){
        let errors = resp.errors;
        Object.keys(errors).forEach(key => {
            $(`#${key}-err`).text( errors[key] );
        });
    }else{
        $("#lucky-results").text(`
        Your lucky number is ${resp.number} (${resp.numberFact}).
        Your birth year (${resp.year}) fact is ${resp.yearFact}.`);
    }
}


$("#lucky-form").on("submit", processForm);
