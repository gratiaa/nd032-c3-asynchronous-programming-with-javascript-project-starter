// API CALLS ------------------------------------------------

const SERVER = "http://localhost:8000";

const defaultFetchOpts = () => ({
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": SERVER,
  },
});

const getTracks = () =>
  fetch(`${SERVER}/api/tracks`)
    .then((response) => response.json())
    .catch((err) => console.error("Problem with getTracks request::", err));

const getRacers = () =>
  fetch(`${SERVER}/api/cars`)
    .then((response) => response.json())
    .catch((err) => console.error("Problem with getRacers request::", err));

const createRace = (player_id, track_id) => {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);

  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "jsonp",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.error("Problem with createRace request::", err));
};

const getRace = (id) =>
  fetch(`${SERVER}/api/races/${id - 1}`)
    .then((res) => res.json())
    .catch((err) => console.error("Problem with getRace request::", err));

const startRace = (id) =>
  fetch(`${SERVER}/api/races/${id - 1}/start`, {
    method: "POST",
    ...defaultFetchOpts(),
  }).catch((err) => console.error("Problem with startRace request::", err));

const accelerate = (id) =>
  fetch(`${SERVER}/api/races/${id - 1}/accelerate`, {
    method: "POST",
    ...defaultFetchOpts(),
  }).catch((err) => console.error("Problem with startRace request::", err));

export { getTracks, getRacers, createRace, getRace, startRace, accelerate };
