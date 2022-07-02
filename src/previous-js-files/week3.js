let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

// Function to convert Celcius to Fahrenheit
function convertCtoF(x) {
  return Math.ceil(x * (9 / 5) + 32);
}

//Function that checks if a string is empty
function isEmpty(x) {
  if (x != null) {
    x = x.trim();
    if (x.length > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return null;
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

//Change current Temperature
function updateCurrentTemp(newTemp) {
  newTemp = convertCtoF(newTemp);
  newTemp = document.getElementById("current_temp").innerHTML = newTemp;
}

//Change current City Name
function updateCurrentCity(newCity) {
  newCity = fixCasing(newCity);
  document.getElementById("current_city").innerHTML = newCity;
}

//Change current City's Humidity
function updateCurrentHum(newHum) {
  document.getElementById("current_hum").innerHTML = newHum;
}
function correctURLSearchCasing(x) {
  x = x.toLowerCase();
  x = x.split(" ");
  x = x.join("+");
  return x;
}

function searchCity(city) {
  if (city in weather) {
    alert(
      `It is currently ${weather[city].temp}°C (${convertCtoF(
        weather[city].temp
      )}°F) in ${fixCasing(city)} with a humidity of ${
        weather[city].humidity
      }%.`
    );
    updateCurrentTemp(weather[city].temp);
    updateCurrentHum(weather[city].humidity);
    updateCurrentCity(city);
  } else {
    city = correctURLSearchCasing(city);
    alert(
      `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
    );
  }
}

// Function to prompt user to input a city upon page loading
function promptCity() {
  let city = prompt("Enter a city");

  //Checks user input a city name and prompt user to try again
  let empty = isEmpty(city);
  if (city == null) {
    alert("Use the search bar to look up a city when ready.");
  }
  if (empty) {
    city = prompt("Error empty. Please input a valid city.");
    empty = isEmpty(city);
    //Rechecks if the input has changed
    if (empty || city == null) {
      alert("Use the search bar to look up a city when ready.");
    }
  }
  if (empty === false) {
    city = city.trim();
    searchCity(city);
  }
}

// Search form input
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input").value;
  searchInput = searchInput.trim();
  searchInput = searchInput.toLocaleLowerCase();
  searchCity(searchInput);
}

// Page load prompt
promptCity();

//Selects the form
let form = document.querySelector("#search-form");

//Event for button to wait for the click to call the "subscribe" function
form.addEventListener("submit", search);
