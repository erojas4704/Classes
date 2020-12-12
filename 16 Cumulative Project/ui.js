$(async function () {
  // cache some selectors we'll be using quite a bit
  const $allStoriesList = $("#all-articles-list");
  const $submitForm = $("#submit-form");
  const $filteredArticles = $("#filtered-articles");
  const $loginForm = $("#login-form");
  const $createAccountForm = $("#create-account-form");
  const $ownStories = $("#my-articles");
  const $navLogin = $("#nav-login");
  const $navLogOut = $("#nav-logout");
  const $navUserMenu = $("#nav-user-menu");
  const $favoritedArticles = $("#favorited-articles");
  const $navProfile = $("#nav-profile");

  // global storyList variable
  let storyList = null;

  // global currentUser variable
  let currentUser = null;

  await checkIfLoggedIn();

  /**
   * Event listener for logging in.
   *  If successfully we will setup the user instance
   */

  $loginForm.on("submit", async function (evt) {
    evt.preventDefault(); // no page-refresh on submit

    // grab the username and password
    const username = $("#login-username").val();
    const password = $("#login-password").val();

    // call the login static method to build a user instance
    const userInstance = await User.login(username, password)
      .catch(err => {
        console.log(err);
        if (err.response.status === 404 || err.response.status == 401) {
          $("#form-response").remove();
          $(`<h4 id="form-response" class="warn">Invalid username or password!</h4>`).insertBefore("#login-form hr");
        }
      });

    // set the global user to the user instance
    if (userInstance) {
      currentUser = userInstance;
      syncCurrentUserToLocalStorage();
      loginAndSubmitForm();
      updateUserStats(userInstance);
    }
  });

  /**
   * Event listener for signing up.
   *  If successfully we will setup a new user instance
   */

  $createAccountForm.on("submit", async function (evt) {
    evt.preventDefault(); // no page refresh

    // grab the required fields
    let name = $("#create-account-name").val();
    let username = $("#create-account-username").val();
    let password = $("#create-account-password").val();

    // call the create method, which calls the API and then builds a new user instance
    const newUser = await User.create(username, password, name)
      .catch(err => {
        //409 Conflict
        if (err.response.status === 409) {
          $("#form-response").remove();
          $createAccountForm.append($(`<h4 id="form-response" class="warn">Username taken.</h4>`));
        }
      });

    if (newUser) {
      currentUser = newUser;
      syncCurrentUserToLocalStorage();
      loginAndSubmitForm();
      updateUserStats(newUser);
    }
  });

  $navProfile.on('click', e => {
    hideElements();
    $("#user-profile").show();
  });

  $("#um-submit").on("click", e => {
    hideElements();
    $allStoriesList.show();
    $submitForm.show();
  });

  $("#um-stories").on("click", e => {
    hideElements();
    $ownStories.show();
    generateMyStories();

  });

  $("#um-favorites").on("click", e => {
    hideElements();
    $favoritedArticles.show();
    generateFavorites();
  });

  /**Add a new story. */
  $submitForm.on("submit", async e => {
    e.preventDefault();

    let form = {};
    $("input", $submitForm).each((i, el) => {
      form[el.id] = el.value;
      el.value = "";
    });

    form.username = currentUser.username;

    let response = await storyList.addStory(currentUser, new Story(form));
    let newStory = response.data.story;
    if (newStory == undefined) return;

    $allStoriesList.prepend(generateStoryHTML(newStory));
  })

  /**Add a story to favorites */
  $(".articles-container").on("click", ".story-fav", e => {
    let $entry = $(e.target).parents(".story-entry");

    //Favorite story
    let isFavorite = $entry.attr("data-favorite") === "true";
    let story = storyList.getStoryById($entry.attr('id'));

    console.log("clickity clicky clicky bong ");

    if (!isFavorite) {
      $entry.attr("data-favorite", "true");
      currentUser.favoriteStory(story);
    }
    else {
      $entry.attr("data-favorite", "false");
      currentUser.unfavoriteStory(story)
    };

    $entry.replaceWith(generateStoryHTML(story));

  });

  /**
   * Delete a story.
   */
  $(".articles-container").on("click", ".story-delete", async e => {
    let $entry = $(e.target).parents(".story-entry");
    let story = storyList.getStoryById($entry.attr('id'));


    let response = await storyList.deleteStory(currentUser, story);
    if (response.status === 200) $entry.remove();
  });

  /**
   * Log Out Functionality
   */

  $navLogOut.on("click", function () {
    // empty out local storage
    localStorage.clear();
    // refresh the page, clearing memory
    location.reload();
  });

  /**
   * Event Handler for Clicking Login
   */

  $navLogin.on("click", function () {
    // Show the Login and Create Account Forms
    $loginForm.slideToggle();
    $createAccountForm.slideToggle();
    $allStoriesList.toggle();
  });

  /**
   * Event handler for Navigation to Homepage
   */

  $("body").on("click", "#nav-all", async function () {
    hideElements();
    await generateStories();
    $allStoriesList.show();
  });

  /**
   * On page load, checks local storage to see if the user is already logged in.
   * Renders page information accordingly.
   */

  async function checkIfLoggedIn() {
    // let's see if we're logged in
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // if there is a token in localStorage, call User.getLoggedInUser
    //  to get an instance of User with the right details
    //  this is designed to run once, on page load
    currentUser = await User.getLoggedInUser(token, username);
    await generateStories();

    if (currentUser) {
      showNavForLoggedInUser();
      updateUserStats(currentUser);
    }
  }

  /**
   * A rendering function to run to reset the forms and hide the login info
   */

  function loginAndSubmitForm() {
    // hide the forms for logging in and signing up
    $loginForm.hide();
    $createAccountForm.hide();

    // reset those forms
    $loginForm.trigger("reset");
    $createAccountForm.trigger("reset");

    // show the stories
    $allStoriesList.show();

    // update the navigation bar
    showNavForLoggedInUser();
  }

  function updateUserStats(user){
    if(user === undefined) return;

    $("#nav-profile small").text(user.username);
    $("#profile-name").text(`Name: ${user.name}`);
    $("#profile-username").text(`Username: ${user.username}`);
    $("#profile-account-date").text(`Account Created: ${formatDate(user.createdAt)}`);
  }

  /**
   * A rendering function to call the StoryList.getStories static method,
   *  which will generate a storyListInstance. Then render it.
   */

  async function generateStories() {
    // get an instance of StoryList
    const storyListInstance = await StoryList.getStories();
    // update our global variable
    storyList = storyListInstance;
    // empty out that part of the page
    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
      const result = generateStoryHTML(story);
      $allStoriesList.append(result);
    }
  }

  async function generateFavorites() {
    storyList = await StoryList.getStories();

    $favoritedArticles.empty();
    if (currentUser.favorites.length < 1) {
      $favoritedArticles.append($("<h3>There seems to be nothing here.</h3>"));
      return;
    }
    for (let story of currentUser.favorites) {
      const result = generateStoryHTML(story);
      $favoritedArticles.append(result);
    }
  }

  async function generateMyStories() {
    storyList = await StoryList.getStories();

    $ownStories.empty();
    if (currentUser.ownStories.length < 1) {
      $ownStories.append($("<h3>There seems to be nothing here.</h3>"));
      return;
    }

    for (let story of currentUser.ownStories) {
      const result = generateStoryHTML(story);
      $ownStories.append(result);
    }
  }

  /**
   * A function to render HTML for an individual Story instance
   */

  function generateStoryHTML(story) {
    let hostName = getHostName(story.url);
    let isFavorite = false;

    let showOptions = currentUser?.isAuthorOf(story);

    if (currentUser) isFavorite = currentUser.favorites.some(fav => fav.storyId === story.storyId);

    // render story markup
    const storyMarkup = $(`
      <li id="${story.storyId}" class="story-entry" data-favorite="${isFavorite}">
        <small class="story-fav">
          ${isFavorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'}
        </small>
        <a class="article-link" href="${story.url}" target="a_blank">
          <strong>${story.title}</strong>
        </a>
        <small class="article-author">by ${story.author}</small>
        <small class="article-hostname ${hostName}">(${hostName})</small>
        <small class="article-username">posted by ${story.username} ${showOptions ? `<a class="story-delete" style="margin-left: 24px">Delete</a>` : ""}</small>
      </li>
    `);

    return storyMarkup;
  }

  /* hide all elements in elementsArr */

  function hideElements() {
    const elementsArr = [
      $submitForm,
      $allStoriesList,
      $filteredArticles,
      $loginForm,
      $createAccountForm,
      $ownStories,
      $favoritedArticles
    ];
    elementsArr.forEach($elem => $elem.hide());
  }

  function showNavForLoggedInUser() {
    $navLogin.hide();
    $navLogOut.show();
    $navProfile.show();
    $navUserMenu.show();
  }

  /* simple function to pull the hostname from a URL */

  function getHostName(url) {
    let hostName;
    if (url.indexOf("://") > -1) {
      hostName = url.split("/")[2];
    } else {
      hostName = url.split("/")[0];
    }
    if (hostName.slice(0, 4) === "www.") {
      hostName = hostName.slice(4);
    }
    return hostName;
  }

  /* sync current user information to localStorage */

  function syncCurrentUserToLocalStorage() {
    if (currentUser) {
      localStorage.setItem("token", currentUser.loginToken);
      localStorage.setItem("username", currentUser.username);
    }
  }
});

function formatDate (dateString){
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}