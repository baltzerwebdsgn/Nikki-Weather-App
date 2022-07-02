let weather = {
  paris: {
    current: {
      temp: 89,
      tempH: 90,
      tempL: 64,
      forecast: "sunny",
      feels_like: 89,
      humidity: 47,
      in_hours1: {
        temp: 84,
        forecast: "sunny",
      },
      in_hours2: {
        temp: 90,
        forecast: "sunny",
      },
      in_hours3: {
        temp: 90,
        forecast: "sunny",
      },
      in_hours4: {
        temp: 90,
        forecast: "sunny",
      },
      in_hours5: {
        temp: 89,
        forecast: "sunny",
      },
      in_hours6: {
        temp: 87,
        forecast: "sunny",
      },
      in_hours7: {
        temp: 83,
        forecast: "sunny",
      },
      in_hours8: {
        temp: 78,
        forecast: "moon",
      },
      in_hours9: {
        temp: 76,
        forecast: "moon",
      },
    },
    tomorrow: {
      tempH: 95,
      tempL: 68,
      forecast: "sunny",
    },
    afterTomorrowDay1: {
      tempH: 94,
      tempL: 72,
      forecast: "sunny",
    },
    afterTomorrowDay2: {
      tempH: 85,
      tempL: 72,
      forecast: "stormy",
    },
    afterTomorrowDay3: {
      tempH: 88,
      tempL: 73,
      forecast: "stormy",
    },
    afterTomorrowDay4: {
      tempH: 96,
      tempL: 73,
      forecast: "partly cloudy",
    },
    afterTomorrowDay5: {
      tempH: 98,
      tempL: 75,
      forecast: "sunny",
    },
  },
};

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

//Function to display the corresponding icon
function formatIcon(value) {
  if (value === "sunny") {
    return "☀️";
  } else if (value === "moon") {
    return "🌙";
  } else if (value === "partly cloudy") {
    return "🌤";
  } else if (value === "cloudy") {
    return "🌥";
  } else if (value === "cloudy w/chance rain") {
    return "🌦";
  } else if (value === "rainy") {
    return "🌧";
  } else if (value === "stormy") {
    return "⛈";
  } else if (value === "snowy") {
    return "🌨";
  }
}
// Function to convert Fahrenheit to Celcius
function convertFtoC(x) {
  return Math.ceil((x - 32) * (5 / 9));
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

function updateTemperatureValue(value, destination, unit) {
  if (unit === "F") {
    updateText(value, destination);
  } else if (unit === "C") {
    updateText(convertFtoC(value), destination);
  }
}

function updateAllTemperatureValues(unit) {
  updateTemperatureValue(weather.paris.current.temp, "#current_temp", unit);
  updateTemperatureValue(weather.paris.current.feels_like, "#current_rf", unit);
  updateTemperatureValue(weather.paris.tomorrow.tempH, "#h-aside-num-1", unit);
  updateTemperatureValue(weather.paris.tomorrow.tempL, "#l-aside-num-1", unit);
  //Updates high temperature values in the aside section
  for (let i = 1; i < 6; i++) {
    updateTemperatureValue(
      weather.paris["afterTomorrowDay" + i].tempH,
      "#h-aside-num-" + i,
      unit
    );
  }
  //Updates low temperature values in the aside section
  for (let i = 1; i < 6; i++) {
    updateTemperatureValue(
      weather.paris["afterTomorrowDay" + i].tempL,
      "#l-aside-num-" + i,
      unit
    );
  }
  //Updates the temperatures in the cards
  for (let i = 1; i < 10; i++) {
    updateTemperatureValue(
      weather.paris.current["in_hours" + i].temp,
      "#f-card-num-" + i,
      unit
    );
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
    updateAllTemperatureValues("F");
    text.innerHTML = "Celsius";
  } else if (value === "Celsius") {
    updatePageUnits("°C");
    updateAllTemperatureValues("C");
    text.innerHTML = "Fahrenheit";
  }
}

//Update current weather icon
function updateWeatherIcon(value, destination) {
  updateText(formatIcon(value), destination);
}

//Update weather icons
function updateAllWeatherIcons() {
  updateWeatherIcon(weather.paris.current.forecast, "#current_icon");
  updateWeatherIcon(weather.paris.tomorrow.forecast, "#i0");
  for (let i = 1; i < 6; i++) {
    updateWeatherIcon(weather.paris["afterTomorrowDay" + i].forecast, "#i" + i);
  }
  for (let i = 1; i < 10; i++) {
    updateWeatherIcon(
      weather.paris.current["in_hours" + i].forecast,
      "#wi" + i
    );
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

//Change current City's Real Feel
function updateCurrentRF(newRF) {
  updateText(newRF, "#current_rf");
}

//Change current City's Humidity
function updateCurrentHum(newHum) {
  updateText(newHum, "#current_hum");
}

// Search form input
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input").value;
  searchInput = searchInput.trim();
  searchInput = searchInput.toLocaleLowerCase();
  searchCity(searchInput);
}
// Updates page upon searching
function searchCity(city) {
  updateCurrentCity(city);
}

//Upon load actions
updateAllTemperatureValues("F");
updateAllWeatherIcons();
let now = new Date();
updateCurrentDateTime(now);
updateCurrentHum(weather.paris.current.humidity);
updateCurrentRF(weather.paris.current.feels_like);

//Selects the unit conversion button
let unitButton = document.querySelector("#convert-unit");

//Event for converting the temperature units
unitButton.addEventListener("click", convertUnit);

//Selects the form
let form = document.querySelector("#search-form");

//Event for submit the city search bar
form.addEventListener("submit", search);
