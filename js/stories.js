"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  //ADDED
  if (currentUser) {
    for (let story of currentUser.ownStories) {
      addDeleteButton(story.storyId);
    }
    for (let story of currentUser.favorites) {
      addUnfaveButton(story.storyId);
    }
    for (let story of storyList.stories) {
      if (!document.querySelector(`#unfave${story.storyId}`)) {
        addFaveButton(story.storyId);
      }
    }
  }
}
//ADDED

//ADDED

let $submitStoryTitle = $("#submit-story-title").val();
let $submitStoryAuthor = $("#submit-story-author").val();
let $submitStoryUrl = $("#submit-story-url").val();

/**Add story from form to storyList */

async function addStoryFromForm() {
  await storyList.addStory(currentUser, {
    title: $submitStoryTitle,
    author: $submitStoryAuthor,
    url: $submitStoryUrl,
  });
  navAllStories();
}

document
  .querySelector("#submit-story-button")
  .addEventListener("click", () => addStoryFromForm());

// Click to delete, favorite, or unfavorite

document.querySelector("body").addEventListener("click", (evt) => {
  if (evt.target.dataset.delete) {
    storyList.deleteStory(currentUser, evt.target.dataset.delete);
    evt.target.parentNode.remove();
  }
  if (evt.target.dataset.fave) {
    currentUser.favoriteStory(evt.target.dataset.fave);
    addUnfaveButton(evt.target.parentNode.id);
    evt.target.remove();
  }
  if (evt.target.dataset.unfave) {
    currentUser.unFavoriteStory(evt.target.dataset.unfave);
    addFaveButton(evt.target.parentNode.id);
    evt.target.remove();
  }
});

/** Adds a button to delete a currentUser posted story */

function addDeleteButton(deleteStoryId) {
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("type", "input");
  deleteButton.setAttribute("id", `delete${deleteStoryId}`);
  deleteButton.setAttribute("class", "delete-button");
  deleteButton.setAttribute("data-delete", `${deleteStoryId}`);
  deleteButton.append("Delete Story");
  $(`#${deleteStoryId}`).append(deleteButton);
}

/** Adds a button to unfavorite a currentUser favorite story */

function addUnfaveButton(unfaveStoryId) {
  let unFaveButton = document.createElement("button");
  unFaveButton.setAttribute("type", "input");
  unFaveButton.append("Remove from Favorites");
  unFaveButton.setAttribute("class", "unfave");
  unFaveButton.setAttribute("id", `unfave${unfaveStoryId}`);
  unFaveButton.setAttribute("data-unfave", `${unfaveStoryId}`);
  $(`#${unfaveStoryId}`).append(unFaveButton);
}

/** Adds a button to favorite a story in storyList */

function addFaveButton(faveStoryId) {
  let faveButton = document.createElement("button");
  faveButton.setAttribute("type", "input");
  faveButton.append("Add to Favorites");
  faveButton.setAttribute("class", "fave-button");
  faveButton.setAttribute("data-fave", `${faveStoryId}`);
  $(`#${faveStoryId}`).append(faveButton);
}
