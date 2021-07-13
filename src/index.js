// When setting the time, format the minutes with the zero for digits less than 10
function formatMinutes() {
  let now = new Date();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return minutes;
}

//When setting the time, toggle AM or PM correctly
function ToggleAMPM(hours) {
  let amPM = document.querySelector("#am-pm");
  if (hours >= 12) {
    amPM.innerHTML = "pm";
  } else {
    amPM.innerHTML = "am";
  }
}

//When setting the time, apply the U.S. format to hours after 12:00pm
function formatHours() {
  let now = new Date();
  let hours = now.getHours();
  ToggleAMPM(hours);
  if (hours > 12) {
    hours -= 12;
  }
  return hours;
}

//When setting the time, format the time
function getTime() {
  let hours = formatHours();
  let minutes = formatMinutes();
  let time = `${hours}:${minutes}`;
  return time;
}

//When setting the day, apply the correct day name
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

//Set the day
function displayDay() {
  let dayDisplayed = document.querySelector("#day");
  dayDisplayed.innerHTML = `${getDayName()} `;
}
//Set the time
function displayTime() {
  let timeDisplayed = document.querySelector("#time");
  timeDisplayed.innerHTML = getTime();
}

// //Change current city name and temp to match city submitted in search form
function updateCityName() {
  let city = document.querySelector("#city-entered");
  city = city.value.toLowerCase();
  let currentCity = document.querySelector("#current-city-displayed");
  currentCity.innerHTML = city;
  //Add something here to allow people to enter cite name and state abbreviation, or zip code
}
function updateTemperature(response) {
  let temp = Math.round(response.data.main.temp);
  let currentDegrees = document.querySelector("#main-temp");
  currentDegrees.innerHTML = `${temp}`;
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
  let windDisplayed = document.querySelector("#wind-speed");
  windDisplayed.innerHTML = windSpeed;
}

function updateHiLo(response) {
  //Don't forget to delete the console.log later
  console.log(response.data);
  let high = Math.round(response.data.main.temp_max);
  let low = Math.round(response.data.main.temp_min);
  let highDisplayed = document.querySelector("#high-temp-now");
  let lowDisplayed = document.querySelector("#low-temp-now");
  highDisplayed.innerHTML = high;
  lowDisplayed.innerHTML = low;
}

//Add a drizzle icon and test this function with different weather codes
//Updating the weather icon based on the current weather code
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

//Updating the city name to lat and long when the GPS button is clicked
function changeNameToGPS(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let gPSCoords = `Latitude ${latitude.toFixed(
    2
  )}, Longitude ${longitude.toFixed(2)}`;
  let location = document.querySelector("#current-city-displayed");
  location.innerHTML = gPSCoords;
}

//Updating the temperature and other weather details when the GPS button is clicked
function getTempByGPS(position) {
  let apiKey = "68c9ee99b56155d1827a40287a70216c";
  let units = "imperial";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateCurrentData);
}

//Updating the city name and temperature when the GPS button is clicked
function updateDisplayToGps(position) {
  changeNameToGPS(position);
  getTempByGPS(position);
}

//Getting the GPS coordinates when the GPS arrow is clicked
function getGps() {
  navigator.geolocation.getCurrentPosition(updateDisplayToGps);
}

function calculateCelsius(number) {
  return Math.round(((number - 32) * 5) / 9);
}

function calculateImperialTemp(number) {
  return Math.round((number * 9) / 5 + 32);
}

function switchtoKMH(number) {
  return Math.round(number * 1.609);
}
function switchtoMPH(number) {
  return Math.round(number / 1.609);
}

//Switching the units and converting the temperature to celsius
function switchToCelsius() {
  //Converting the main temp
  let mainUnit = document.querySelector("#unit");
  mainUnit.innerHTML = "°C";
  altUnit.innerHTML = " |°F";
  let temp = document.querySelector("#main-temp");
  let newTemp = calculateCelsius(temp.innerHTML);
  temp.innerHTML = newTemp;
  //Converting the hi-lo
  let highDisplayed = document.querySelector("#high-temp-now");
  let lowDisplayed = document.querySelector("#low-temp-now");
  let newHigh = calculateCelsius(highDisplayed.innerHTML);
  let newLow = calculateCelsius(lowDisplayed.innerHTML);
  highDisplayed.innerHTML = newHigh;
  lowDisplayed.innerHTML = newLow;
  //Converting the wind speed - NOT WORKING
  let windSpeed = document.querySelector("#wind-speed");
  console.log(windSpeed);
  let windUnit = document.querySelector("#wind-unit");
  console.log(document.querySelector("#wind-unit"));
  windUnit.innerHTML = "km/h";
  let newSpeed = switchtoKMH(windSpeed.innerHTML);
  windSpeed.innerHTML = newSpeed;
}

//Switching the units and converting the temperature to imperial
function switchToImperial() {
  let mainUnit = document.querySelector("#unit");
  mainUnit.innerHTML = "°F";
  altUnit.innerHTML = " |°C";
  let temp = document.querySelector("#main-temp");
  let newTemp = calculateImperialTemp(temp.innerHTML);
  temp.innerHTML = newTemp;
  //Converting the hi-lo
  let highDisplayed = document.querySelector("#high-temp-now");
  let lowDisplayed = document.querySelector("#low-temp-now");
  let newHigh = calculateImperialTemp(highDisplayed.innerHTML);
  let newLow = calculateImperialTemp(lowDisplayed.innerHTML);
  highDisplayed.innerHTML = newHigh;
  lowDisplayed.innerHTML = newLow;
  //Converting the wind speed
  let windSpeed = document.querySelector("#wind-speed");
  let windUnit = document.querySelector("#wind-unit");
  windUnit.innerHTML = "mph";
  let newSpeed = switchtoMPH(windSpeed.innerHTML);
  windSpeed.innerHTML = newSpeed;
}

//Establishing the condition for switching to imperial or celsius when altUnit is clicked
function switchUnits() {
  if (altUnit.innerHTML === " |°C") {
    switchToCelsius();
  } else if (altUnit.innerHTML === " |°F") {
    switchToImperial();
  }
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

//Adding a listener to the alternate temperature unit
let altUnit = document.querySelector("#alt-unit");
altUnit.addEventListener("click", switchUnits);
