class Movie {
    constructor(title, rating) {
        this.title = title;
        this.rating = Number(rating);
    }

}
let movies = [];
let ascendingSort = 1;

$(() => {
    const $form = $("#form_movie");

    $form.submit(e => {
        e.preventDefault();
        let values = {};

        $('#form_movie > input').each((i, el) => {
            values[el.name] = $(el).val();
        });


        if (isFormValid(values)) {
            let movie = new Movie(values.title, values.rating);
            movie.index = movies.length;

            movies.push(movie);
            $('#form_movie input').val("");

            addMovie(movie);
        } else {
            console.log("Form is invalid.");
        }
    });

    $('#movie_list').on('click', ".movie-remove", e => {
        let $listing = $(e.target).parent();

        movies[$listing.data('index')] = undefined;
        $listing.remove();

        localStorage.movies = JSON.stringify(movies);
    });

    $('#sort_options').change(() => {
        //Sort
        let sortValue = $(`#sort_options > input[name="sort"]:checked`).val();

        sort(sortValue);
    });
    
    $('#sort_options').click(() => {
        ascendingSort *= -1;
        let sortValue = $(`#sort_options > input[name="sort"]:checked`).val();

        sort(sortValue);
    });

});

function sort(style) {

    $("#movie_list .movie-listing").sort((a, b) => {
        return ($(a).data(style) < $(b).data(style))? -1 * ascendingSort : 1 * ascendingSort;
    }).appendTo('#movie_list');
    return;
}

function addMovie(movie) {
    $("#movie_list")
        .append(`
    <div class="movie-listing" data-title="${movie.title}" data-rating="${movie.rating}" data-index="${movie.index}">
        <h1 class="movie-rating">${movie.rating}</h1>
        <div class="movie-title">${movie.title}</div>
        <button class="movie-remove">Remove</div>
    </div>`);

    localStorage.movies = JSON.stringify(movies);
}

function isFormValid(values) {
    if (values.title.length < 2) return false;

    console.log(values.rating);
    if (values.rating.length < 1 || isNaN(values.rating) || values.rating < 0 || values.rating > 10) return false;

    return true;
}