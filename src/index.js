function formatMinutes() {
  let now = new Date();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return minutes;
}

function ToggleAMPM(hours) {
  let amPM = document.querySelector("#am-pm");
  if (hours >= 12) {
    amPM.innerHTML = "pm";
  } else {
    amPM.innerHTML = "am";
  }
}

function formatHours() {
  let now = new Date();
  let hours = now.getHours();
  ToggleAMPM(hours);
  if (hours > 12) {
    hours -= 12;
  }
  return hours;
}

function getTime() {
  let now = new Date();
  let hours = formatHours();
  let minutes = formatMinutes();
  let time = `${hours}:${minutes}`;
  return time;
}

function getDayName() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let now = new Date();
  let day = days[now.getDay()];
  return day;
}

function displayDay() {
  let dayDisplayed = document.querySelector("#day");
  dayDisplayed.innerHTML = `${getDayName()} `;
}
function displayTime() {
  let timeDisplayed = document.querySelector("#time");
  timeDisplayed.innerHTML = getTime();
}

// //Change current city name and temp to match city submitted in search form
function updateCityName() {
  let city = document.querySelector("#city-entered");
  let currentCity = document.querySelector("#current-city-displayed");
  currentCity.innerHTML = city.value;
  //Add something here to allow people to enter cite name and state abbreviation, or zip code
}
function updateTemperature(response) {
  let temp = Math.round(response.data.main.temp);
  let currentDegrees = document.querySelector("#main-temp");
  currentDegrees.innerHTML = `${temp}°`;
}

function updateDescription(response) {
  let descriptionInfo = response.data.weather[0].description;
  descriptionInfo =
    descriptionInfo[0].toUpperCase() + descriptionInfo.substring(1);
  let descriptionDisplayed = document.querySelector("#description");
  descriptionDisplayed.innerHTML = descriptionInfo;
}

function updateWindSpeed(response) {
  let windSpeed = Math.round(response.data.wind.speed);
  let windDisplayed = document.querySelector("#wind");
  windDisplayed.innerHTML = `Wind speed: ${windSpeed}mph`;
}

function updateHiLo(response) {
  console.log(response.data);
  let high = Math.round(response.data.main.temp_max);
  let low = Math.round(response.data.main.temp_min);
  let highDisplayed = document.querySelector("#current-high");
  let lowDisplayed = document.querySelector("#current-low");
  highDisplayed.innerHTML = `H: ${high}°`;
  lowDisplayed.innerHTML = ` L: ${low}°`;
}
//Add a drizzle icon and test this function with different weather codes
function updateImage(response) {
  let weatherID = response.data.weather[0].id;
  let weatherIcon = document.querySelector("#weather-icon");
  if (weatherID === 800) {
    weatherIcon.src = "src/day/clear.png";
  } else if (weatherID > 802 || weatherID === 781) {
    weatherIcon.src = "src/day/clouds.png";
  } else if (weatherID > 800 && weatherID < 803) {
    weatherIcon.src = "src/day/light-clouds.png";
  } else if (weatherID > 700 && weatherID < 772) {
    weatherIcon.src = "src/day/mist.png";
  } else if (weatherID > 599 && weatherID < 623) {
    weatherIcon.src = "src/day/snow.png";
  } else if (weatherID > 199 && weatherID < 233) {
    weatherIcon.src = "src/day/storm.png";
  } else if (weatherID > 499 && weatherID < 532) {
    weatherIcon.src = "src/day/rain.png";
  } else {
    weatherIcon.src = "src/day/rain.png";
  }
}
//Functions called when someone clicks the search or GPS button
function updateCurrentData(response) {
  updateTemperature(response);
  updateDescription(response);
  updateWindSpeed(response);
  updateHiLo(response);
  updateImage(response);
}

//Getting the temperature triggers the update of the rest of the information on the page
//For better consistency, I should separate out an API call function from an update Temp function
function getTempByCity() {
  let apiKey = "68c9ee99b56155d1827a40287a70216c";
  let currentCity = document.querySelector("#current-city-displayed");
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity.innerHTML}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateCurrentData);
}

function updateDisplayToCity() {
  updateCityName();
  getTempByCity();
}

function changeNameToGPS(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let gPSCoords = `Latitude ${latitude.toFixed(
    2
  )}, Longitude ${longitude.toFixed(2)}`;
  let location = document.querySelector("#current-city-displayed");
  location.innerHTML = gPSCoords;
}
function getTempByGPS(position) {
  let apiKey = "68c9ee99b56155d1827a40287a70216c";
  let units = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateCurrentData);
}

function updateDisplayToGps(position) {
  changeNameToGPS(position);
  getTempByGPS(position);
}

function getGps() {
  navigator.geolocation.getCurrentPosition(updateDisplayToGps);
}

//Calling functions to run on initiation
getTempByCity();
displayDay();
displayTime();

//Adding a listener for the search icon
let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("click", updateDisplayToCity);

//Adding a listener for the GPS icon
let gpsSearch = document.querySelector("#gps-search");
gpsSearch.addEventListener("click", getGps);
