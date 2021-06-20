import {
  renderRacerCars,
  renderRacerCard,
  renderTrackCards,
  renderTrackCard,
  renderCountdown,
  renderRaceStartView,
  resultsView,
  renderAt,
  raceProgress,
} from "./modules/render.js";

import {
  getTracks,
  getRacers,
  createRace,
  getRace,
  startRace,
  accelerate,
} from "./modules/api.js";

// The store will hold all information needed globally
var store = {
  track_id: undefined,
  player_id: undefined,
  race_id: undefined,
};

async function onPageLoad() {
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt("#tracks", html);
    });

    getRacers().then((racers) => {
      const html = renderRacerCars(racers);
      renderAt("#racers", html);
    });
  } catch (error) {
    console.log("Problem getting tracks and racers ::", error.message);
    console.error(error);
  }
}

function setupClickHandlers() {
  document.addEventListener(
    "click",
    function (event) {
      const { target } = event;

      // Race track form field
      if (target.matches(".card.track")) {
        return handleSelectTrack(target);
      }

      // Podracer form field
      if (target.matches(".card.podracer")) {
        return handleSelectPodRacer(target);
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start race
        return handleCreateRace();
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        return handleAccelerate(target);
      }

      return;
    },
    false
  );
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  await onPageLoad();

  setupClickHandlers();
});

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  const { player_id, track_id } = store;

  if (!player_id || !track_id) {
    return alert("Please choose your track and racer");
  }

  // render starting UI
  renderAt("#race", renderRaceStartView());

  const race = await createRace(player_id, track_id);

  // update the store with the race id
  store.race_id = race;

  // The race has been created, now start the countdown
  // call the async function runCountdown
  await runCountdown();

  // call the async function startRace
  await startRace();

  // call the async function runRace
  return runRace();
}

function runRace(raceID) {
  return new Promise((resolve) => {
    // TODO - use Javascript's built in setInterval method to get race info every 500ms
    /* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:

		renderAt('#leaderBoard', raceProgress(res.positions))
	*/
    /* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		reslove(res) // resolve the promise
	*/
  });
  // remember to add error handling for the Promise
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // TODO - use Javascript's built in setInterval method to count down once per second

      // run this DOM manipulation to decrement the countdown for the user
      document.getElementById("big-numbers").innerHTML = --timer;

      // TODO - if the countdown is done, clear the interval, resolve the promise, and return
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectPodRacer(target) {
  console.log("selected a pod", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");

  // save the selected racer to the store
  store.player_id = target.id;
}

function handleSelectTrack(target) {
  console.log("selected a track", target.id);

  // remove class selected from all track options
  const selected = document.querySelector("#tracks .selected");

  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");

  // save the selected track id to the store
  store.track_id = target.id;
}

function handleAccelerate() {
  console.log("accelerate button clicked");
  // TODO - Invoke the API call to accelerate
}
