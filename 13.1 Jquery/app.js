$( () => {
    console.log("Let’s get ready to party with jQuery!");

    $("article img").addClass("image-center");

    $("article p")
    .last()
    .remove();

    let random = Math.random()*100 | 0;

    $("#title").css("font-size", `${random}px`);

    $(".col-sm-4 ol").append("<li>Whatever you want</li>");

    $("aside")
    .empty()
    .append("<p>Sorry for existing</p>");

    $(".form-control").change( () => {
        let r = $(".form-control")[0].value;
        let b = $(".form-control")[1].value;
        let g = $(".form-control")[2].value;

        $("body").css("background-color", `rgb(${r},${g},${b})`);
    });

    $("img").click( e => {
        e.target.remove();
    });

})