var apiKey = "608c088b975473decdd0839c532f4422";
const weather = {};
const today = $("#today");
const searchInput = $("#search-input");
const searchBtn = $("#search-button");
var currentWeatherEl = document.getElementById("current-weather");
var fiveForeE1 = document.getElementById('5-day-forecast');
const history = $("#history");
const forecast = $("#forecast");
const userEntries = [];
// function to get lon and lat to pass them tho getweather function 
function getCoordinates(cityName){
    currentWeatherEl.innerHTML= "";
    fiveForeE1.innerHTML= "";
    var geocodeUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + '&limit=1&appid=' +apiKey;
    fetch(geocodeUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        getForecast(cityLat, cityLon);
    });
};
// create a function to get the waether data from api and display 
function getWeather(lat, lon){
    const queryURL = 'https://api.openweathermap.org/data/2.5/forecast?' +
    'lat=' + lat + '&lon' + lon + apiKey;
    $.ajax({
        URL: queryURL,
        method: 'GET'
    }).then(function(response){
        today.empty();
        forecast.empty();
        let currentDate = moment().format('DD/MM/YYYY');
        const currentDateAndLocation = $('<h2>').text(weather.city +'('+ currentDate +')');
        const currentImage = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon +"@2x.png");
        currentDateAndLocation.append(currentImage);
        const currentTemp = $('<p>').text('Temp:' + Math.floor(parseFloat(response.list[0].main.temp) - 273.15) + '\u2103');
        const currentWind = $('<p>').text('Wind:' +response.list[0].wind.speed + 'KPH');
        const currentHumidity = $("<p>").text("Humidity: " + response.list[0].main.humidity + "%");
        today.append(currentDateAndLocation, currentTemp, currentWind, currentHumidity);
        today.attr("style", "border: 1px solid rgb(35, 34, 34); padding: 15px; background-color: rgb(168, 150, 126);");
        const forecastHeader = $("<h4>").text("5-Day Forecast:");
        const cardDeck = $("<div class='card-deck'></div>");
        forecast.append(forecastHeader, cardDeck);
        let currentForecastDay;
        let daysToAdd = 1;
        for (let i = 8; i<response.list.length; i=i+8) {
            const card = $("<div class='card' style='width: 200px; color: white; background-color: rgb(51, 51, 137);'></card>");
            cardDeck.append(card);
            const cardBody = $("<div class='card-body'></div>");
            card.append(cardBody);
            currentForecastDay = moment().add(daysToAdd, "days").format("DD/MM/YYYY");
            const cardTitle = $("<h5 class='card-title'></h5>").text(currentForecastDay);
            daysToAdd++;
            const image = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon +"@2x.png");
            const temp = $("<p>").text("Temp: " + Math.floor(parseFloat(response.list[i].main.temp) - 273.15) + "\u2103");
            const wind = $("<p>").text("Wind: " + response.list[i].wind.speed + " KPH");
            const humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");
            cardBody.append(cardTitle, image, temp, wind, humidity);
        }
        const card = $("<div class='card' style='width: 200px; color: white; background-color: rgb(51, 51, 137);'></card>");
        cardDeck.append(card);
        const cardBody = $("<div class='card-body'></div>");
        card.append(cardBody);
        currentForecastDay = moment().add(daysToAdd, "days").format("DD/MM/YYYY");
        const cardTitle = $("<h5 class='card-title'></h5>").text(currentForecastDay);
        const image = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[response.list.length-1].weather[0].icon +"@2x.png");
        const temp = $("<p>").text("Temp: " + Math.floor(parseFloat(response.list[response.list.length-1].main.temp) - 273.15) + "\u2103");
        const wind = $("<p>").text("Wind: " + response.list[response.list.length-1].wind.speed + " KPH");
        const humidity = $("<p>").text("Humidity: " + response.list[response.list.length-1].main.humidity + "%");
        cardBody.append(cardTitle, image, temp, wind, humidity);
});
}

function displaySearchHistory() {
    var searchStoredEl = document.getElementById("search-stored");
    searchStoredEl.innerHTML= "";
  
    history.forEach(function (city) {
      var searchButton = document.createElement("button");
      searchButton.classList.add("button", "grey-light", "is-fullwidth", "my-2");
      searchButton.textContent = city;
      searchButton.addEventListener("click", function(){
        getCoordinates(city);
      });
  
      searchStoredEl.appendChild(searchButton);
    });
  }

  searchBtn.addEventListener("click", function() {
      var city = citySearch.value;
      getCoordinates(city);
      saveSearchTerm(city);
      displaySearchHistory();
    });

citySearch.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    var city = citySearch.value;
    getCoordinates(city);
    saveSearchTerm(city);
    displaySearchHistory();
  }
});

displaySearchHistory();