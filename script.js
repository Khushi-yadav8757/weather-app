const cities = ["Delhi","London","Tokyo"]

const container = document.getElementById("weatherContainer")
const loader = document.getElementById("loader")
const input = document.getElementById("cityInput")
const button = document.getElementById("searchBtn")

function weatherInfo(code){

if(code === 0) return {text:"Clear Sky",emoji:"☀️"}
if(code <=3) return {text:"Cloudy",emoji:"⛅"}
if(code <=48) return {text:"Fog",emoji:"🌫"}
if(code <=67) return {text:"Rain",emoji:"🌧"}
if(code <=77) return {text:"Snow",emoji:"❄️"}
if(code <=82) return {text:"Showers",emoji:"🌦"}
if(code <=99) return {text:"Thunderstorm",emoji:"⛈"}

return {text:"Unknown",emoji:"❓"}

}


// coordinates

async function getCoordinates(city){

const res = await fetch(
`https://geocoding-api.open-meteo.com/v1/search?name=${city}`
)

const data = await res.json()

if(!data.results) throw "City not found"

return{

city:city,
lat:data.results[0].latitude,
lon:data.results[0].longitude

}

}


// weather

async function getWeather(loc){

const res = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`
)

const data = await res.json()

return{

city:loc.city,
temp:data.current_weather.temperature,
code:data.current_weather.weathercode

}

}


// card

function createCard(data){

const weather = weatherInfo(data.code)

const card = document.createElement("div")

card.className="card"

card.innerHTML=`

<div class="city">${data.city}</div>
<div class="emoji">${weather.emoji}</div>
<div class="temp">${data.temp}°C</div>
<div class="condition">${weather.text}</div>

`

container.appendChild(card)

}


// load weather

async function loadWeather(cityList){

container.innerHTML=""

loader.classList.remove("hidden")

try{

const locations = await Promise.all(
cityList.map(city=>getCoordinates(city))
)

const weatherData = await Promise.all(
locations.map(loc=>getWeather(loc))
)

weatherData.forEach(createCard)

}

catch(err){

container.innerHTML="<h2>⚠ City not found</h2>"

}

loader.classList.add("hidden")

}


// default cities

loadWeather(cities)


// search button

button.addEventListener("click",()=>{

const city = input.value.trim()

if(city){

loadWeather([city])

input.value=""

}

})
