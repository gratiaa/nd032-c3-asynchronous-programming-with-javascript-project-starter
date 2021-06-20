// HTML VIEWS ------------------------------------------------
const renderRacerCard = (racer) => {
  const { id, driver_name, top_speed, acceleration, handling } = racer;

  return `
		<li>
			<button type="button" class="card podracer" id="${id}">
				<h5>Name: ${driver_name}</h5>
				<p>Top Speed: ${top_speed}</p>
				<p>Acceleration: ${acceleration}</p>
				<p>Handling: ${handling}</p>
			</button>
		</li>
	`;
};

const renderRacerCars = (racers) => {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
};

const renderTrackCard = (track) => {
  const { id, name } = track;

  return `
		<li>
			<button type="button" id="${id}" class="card track">
				<h5>${name}</h5>
			</button>
		</li>
	`;
};

const renderTrackCards = (tracks) => {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
};

const renderCountdown = (count) => `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;

const renderRaceStartView = (track) =>
  `<header>
			<h1>Race: ${track}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>
			<section id="accelerate" class="hide">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;

const resultsView = (positions, playerId) => {
  positions.sort((a, b) => (a.final_position > b.final_position ? 1 : -1));

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions, playerId)}
			<a href="/race">Start a new race</a>
		</main>
	`;
};

const renderAt = (element, html) => {
  const node = document.querySelector(element);

  node.innerHTML = html;
};

const raceProgress = (positions, playerId) => {
  let userPlayer = positions.find((e) => e.id.toString() === playerId);
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
};

export {
  renderRacerCars,
  renderTrackCards,
  renderTrackCard,
  renderRaceStartView,
  resultsView,
  renderAt,
  raceProgress,
};
