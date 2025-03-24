let apiKey = "e950dfc971e240e7808114651251003";
let selectedCity = "";
let isCelsius = true;

function fetchCitySuggestions() {
  const cityInput = document.getElementById("city").value.trim();
  const suggestionsList = document.getElementById("suggestions");

  if (cityInput.length < 2) {
    suggestionsList.innerHTML = "";
    suggestionsList.style.display = "none";
    return;
  }

  fetch(
    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        suggestionsList.style.display = "none";
        return;
      }

      suggestionsList.innerHTML = data
        .map(
          (place) =>
            `<li onclick="selectCity('${place.name}, ${place.region}, ${place.country}')">
              ${place.name}, ${place.region}, ${place.country}
            </li>`
        )
        .join("");

      suggestionsList.style.display = "block";
    })
    .catch((error) =>
      console.error("Error while fetching city suggestions", error)
    );
}

function selectCity(city) {
  document.getElementById("city").value = city;
  document.getElementById("suggestions").style.display = "none";
  selectedCity = city;
}

document.addEventListener("click", function (event) {
  if (!document.getElementById("city").contains(event.target)) {
    document.getElementById("suggestions").style.display = "none";
  }
});

function getWeather() {
  const city = selectedCity || document.getElementById("city").value;
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.getElementById("weather-info").textContent = "City not found!";
      } else {
        document.getElementById("location").textContent = `${city}`;
        updateTemperatureDisplay(
          data.current.temp_c,
          data.current.temp_f,
          data.current.condition.text
        );
      }
    })
    .catch((error) => console.error("Error fetching weather:", error));
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${position.coords.latitude},${position.coords.longitude}&aqi=no`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            document.getElementById("weather-info").textContent =
              "Unable to fetch weather!";
          } else {
            document.getElementById(
              "location"
            ).textContent = `Current Location`;
            updateTemperatureDisplay(
              data.current.temp_c,
              data.current.temp_f,
              data.current.condition.text
            );
          }
        })
        .catch((error) => console.error("Error fetching weather:", error));
    });
  } else {
    document.getElementById("weather-info").textContent =
      "Geolocation is not supported by this browser.";
  }
}

function updateTemperatureDisplay(tempC, tempF, condition) {
  const temperature = isCelsius ? `${tempC}°C` : `${tempF}°F`;
  document.getElementById(
    "weather-info"
  ).innerHTML = `${temperature}<br>${condition}`;
}

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  const city = selectedCity || document.getElementById("city").value;
  if (city) {
    getWeather();
  } else {
    getLocationWeather();
  }
}
