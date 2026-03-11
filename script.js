const container = document.getElementById("weather-container");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");

const cities = [
  { name: "Delhi", lat: 28.61, lon: 77.23 },
  { name: "London", lat: 51.50, lon: -0.12 },
  { name: "New York", lat: 40.71, lon: -74.00 }
];

function getWeatherEmoji(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫";
  if (code <= 67) return "🌧";
  if (code <= 77) return "❄️";
  return "🌦";
}

function fetchWeather(city) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;

  return fetch(url)
    .then(res => res.json())
    .then(data => ({
      city: city.name,
      temp: data.current_weather.temperature,
      code: data.current_weather.weathercode
    }));
}

function createCard(data) {

  const card = document.createElement("div");
  card.className = "card";

  const emoji = getWeatherEmoji(data.code);

  card.innerHTML = `
  <h3>${data.city}</h3>
  <div class="emoji">${emoji}</div>
  <div class="temp">${data.temp}°C</div>
  <p>Weather Code: ${data.code}</p>
  `;

  container.appendChild(card);
}

async function loadWeather() {

  try {

    loader.style.display = "block";

    const promises = cities.map(city => fetchWeather(city));

    const results = await Promise.all(promises);

    loader.style.display = "none";

    results.forEach(data => createCard(data));

  } catch (err) {

    loader.style.display = "none";
    errorBox.textContent = "Failed to load weather data.";

  }
}

loadWeather();
