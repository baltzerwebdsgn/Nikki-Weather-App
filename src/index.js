//Selects the text to be changed
function updateText(newText, destination) {
  let text = document.querySelector(destination);
  text.innerHTML = newText;
}

//Reformats hour to be 12hour clock
function correctHour(hour) {
  if (hour > 12) {
    return hour - 12;
  } else if (hour === 0) {
    return 12;
  } else {
    return hour;
  }
}
// Reformats 1-9 minutes to display correctly
function correctMinutes(minutes) {
  if (minutes < 10) {
    return "0" + minutes;
  } else {
    return minutes;
  }
}

//Formats the dates on the page
function formatDate(now, section, x) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let meridiem = "AM";

  //Updates meridem depending on hour
  if (hour >= 12) {
    meridiem = "PM";
  }

  let newHour = correctHour(hour);
  let newMinutes = correctMinutes(minutes);

  //Formats current date
  if (section === "header") {
    return `${day}, ${month} ${date} ${newHour}:${newMinutes} ${meridiem}`;
  }
  //Formats 6day forecast dates
  else if (section === "aside") {
    day = daysShort[now.getDay()];
    return day;
  }
  //Returns time projection
  else if (section === "main") {
    newHour = newHour + x;
    if (newHour >= 12) {
      meridiem = "PM";
    }
    newHour = correctHour(newHour);
    return `${newHour}${meridiem}`;
  }
}

// Fixes casing on city name
function fixCasing(x) {
  x = x.toLowerCase();

  let words = x.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }
  words = words.join(" ");
  return words;
}

//Function to simplify loops with constant value input
function updateLoop(loopNums, value, idGroupName) {
  for (let i = 1; i < loopNums; i++) {
    updateText(value, idGroupName + i);
  }
}

function updatePageUnits(unitDegree) {
  updateText(unitDegree, "#heading-degree-unit");
  updateText(unitDegree, "#details-degree-unit");
  updateLoop(7, unitDegree, "#h-aside-unit-");
  updateLoop(7, unitDegree, "#l-aside-unit-");
  updateLoop(10, unitDegree, "#f-card-unit-");
}

function convertUnit(event) {
  event.preventDefault();
  let text = document.querySelector("#convert-unit");
  let value = text.innerHTML;

  if (value === "Fahrenheit") {
    updatePageUnits("°F");

    text.innerHTML = "Celsius";
  } else if (value === "Celsius") {
    updatePageUnits("°C");

    text.innerHTML = "Fahrenheit";
  }
}

//Change current page Dates and Time
function updateCurrentDateTime(date) {
  updateText(formatDate(date, "header"), "#current_date");
  for (let i = 1; i < 10; i++) {
    updateText(formatDate(date, "main", i), "#time" + i);
  }
  for (let i = 1; i < 7; i++) {
    date = new Date(new Date().setDate(new Date().getDate() + i));
    updateText(formatDate(date, "aside"), "#d" + i);
  }
}

//Change current City Name
function updateCurrentCity(newCity) {
  updateText(fixCasing(newCity), "#current_city");
}

function updateWeatherIcon(icon, forecast) {
  let srcNew = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weather-icon-current").src = srcNew;
  document.getElementById("weather-icon-current").alt = forecast;
}

function getCurrentData(response) {
  let temp = Math.round(response.data.main.temp);
  let forecast = response.data.weather[0].description;
  let icon = response.data.weather[0].icon;
  let feels_like = Math.round(response.data.main.feels_like);
  let humidity = response.data.main.humidity;

  updateText(temp, "#current_temp");
  updateText(forecast, ".forecast");
  updateWeatherIcon(icon, forecast);
  updateText(feels_like, "#current_rf");
  updateText(humidity, "#current_hum");
}

function getCityHeading(response) {
  let city = response.data[0].name;
  let state = response.data[0].state;
  let country = response.data[0].country;

  if (state !== undefined) {
    updateText(`${city}, ${state}`, "#current_city");
  } else {
    updateText(`${city}, ${country}`, "#current_city");
  }
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "b8f1228856ca04cc31b22654a95bc412";
  let units = "imperial";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiURL = `${apiEndPoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiURL).then(getCurrentData);

  let limit = 1;
  let apiEndPointGeoCoding = "https://api.openweathermap.org/geo/1.0/reverse?";
  let apiURLGC = `${apiEndPointGeoCoding}lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;

  axios.get(apiURLGC).then(getCityHeading);
}

function searchCurrentLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function searchCity(city) {
  let apiKey = "b8f1228856ca04cc31b22654a95bc412";
  let units = "imperial";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiURL = `${apiEndPoint}q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiURL).then(getCurrentData);

  updateCurrentCity(city);
}

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input").value;
  searchInput = searchInput.trim();
  searchCity(searchInput);
}

//Selects the unit conversion button
let unitButton = document.querySelector("#convert-unit");

//Event for converting the temperature units
unitButton.addEventListener("click", convertUnit);

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

let currentButton = document.querySelector("#current-weather-button");

//Event for converting the temperature units
currentButton.addEventListener("click", searchCurrentLocation);

//Upon page load
searchCurrentLocation();
let now = new Date();
updateCurrentDateTime(now);
