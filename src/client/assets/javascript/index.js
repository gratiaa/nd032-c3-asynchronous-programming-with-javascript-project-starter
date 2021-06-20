import {
  renderRacerCars,
  renderTrackCards,
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
  return runRace(store.race_id);
}

function runRace(raceID) {
  if (!raceID) {
    return;
  }

  return new Promise((resolve) => {
    // use Javascript's built in setInterval method to get race info every 500ms
    let status, positions;

    const intervalId = setInterval(() => {
      try {
        const raceInfo = await getRace(raceID);

        status = raceInfo.status;
        positions = raceInfo.positions;
      } catch (err) {
        console.error("Problem with getRace in runRace::", err);
      }
    }, 500);

    if (status === "in-progress") {
      renderAt("#leaderBoard", raceProgress(res.positions));
    } else if (status === "finished") {
      clearInterval(intervalId); // to stop the interval from repeating
      renderAt("#race", resultsView(res.positions)); // to render the results view
      resolve(res); // resolve the promise
    }
  }).catch((err) => {
    console.error("Problem with runRace::", err);
  });
}
async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}
async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);

    let timer = 3;

    return new Promise((resolve) => {
      // TODO - use Javascript's built in setInterval method to count down once per second
      const intervalId = setInterval(() => {
        timer -= 1;
      }, 1000);

      // run this DOM manipulation to decrement the countdown for the user
      document.getElementById("big-numbers").innerHTML = --timer;

      // if the countdown is done, clear the interval, resolve the promise, and return
      clearInterval(intervalId);

      return resolve();
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

  // Invoke the API call to accelerate
  return accelerate(store.race_id);
}
