/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let response = await axios.get('http://api.tvmaze.com/search/shows', {
    params: {
      q: query
    }
  });

  console.log(response);
  return response.data;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  const placeholderImage = "https://tinyurl.com/tv-missing";

  for (let data of shows) {
    let show = data.show;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image.original || placeholderImage}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary || ""}</p>
             <button class="btn episodes btn-primary">Episodes</button>
           </div>
         </div>
       </div>
      `);


    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  console.log("grabbing ", id);
  if (id == undefined) throw 404;

  // TODO: return array-of-episode-info, as described in docstring above
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  //console.log(response);

  populateEpisodes(response.data);
}

function populateEpisodes(episodes) {
  $("#episodes-list").empty();

  for (let ep of episodes) {
    let $node = $(`
      <li>${ep.name} (Season ${ep.season}, Number ${ep.number})</li>
    `);

    $("#episodes-list").append($node);
  }
  $("#episodes-area").show();
}

$("#shows-list").on('click', '.episodes', e => {
  let $container = $(e.target).parents(".card");
  let id = $container.attr("data-show-id");

  getEpisodes(id);
});