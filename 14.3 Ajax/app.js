const onFormSubmit = e => {
    e.preventDefault();

    let form = {};

    $(e.target).find("input").each((index, node) => {
        form[node.name] = $(node).val();
        //It's nice to spam search //$(node).val("");
    });

    getGif(form.term);
}

const deleteAll = e => $(".image").remove()

const getGif = async term => {
    if(term.length < 1){
        alert("type something in, you dipstick");
        return;
    }

    let response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
        params: {
            q: term,
            api_key: 'MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym'
        }
    }).catch( err => {
        console.log(err);
        console.error("Could not retrieve the HILARIOUS THE LE MEME");
        alert("How did you @#$% this up?");
    })

    let imgArray = response.data.data;
    let randomIndex = (Math.random() * imgArray.length) | 0;
    renderImage(response.data.data[randomIndex]);
}

const renderImage = imageData => {
    let imgURL = imageData.images.original.url;

    let $new = $(document.getElementById("template-image").content.cloneNode(true));
    let $img = $new.find("img");

    $new.find("h5").html(imageData.title);

    $("#images").append($new);
    $img.attr("src", imgURL);

    return $new;
}

$(() => {
    $('#the_form').on('submit', onFormSubmit);
    $('#btn_delete').click(deleteAll);
});
