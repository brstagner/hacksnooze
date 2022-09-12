"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $loginForm.hide();
  $signupForm.hide();
  $submitStoryForm.hide();
}

$body.on("click", "#nav-all", navAllStories);

//ADDED
/** Show story submit on click "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  if (!currentUser) {
    alert("Log in first");
  } else {
    hidePageComponents();
    $loginForm.hide();
    $signupForm.hide();
    $submitStoryForm.show();
  }
}
$navSubmitStory.on("click", navSubmitClick);

/** Toggle favorites on click on "toggle favorites" */

let faveToggleCount = 0;

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  $loginForm.hide();
  $signupForm.hide();
  $submitStoryForm.hide();
  if (faveToggleCount === 0) {
    faveToggleCount++;
    for (let story of storyList.stories) {
      $(`#${story.storyId}`).hide();
      for (let fave of currentUser.favorites) {
        if (story.storyId === fave.storyId) {
          $(`#${story.storyId}`).show();
        }
      }
    }
  } else {
    faveToggleCount = 0;
    for (let story of storyList.stories) {
      $(`#${story.storyId}`).show();
    }
    return;
  }
}
$toggleFavorites.on("click", navFavoritesClick);
//ADDED

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $submitStoryForm.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
