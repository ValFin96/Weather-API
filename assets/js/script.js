var currentWeatherEl = document.querySelector(".current-weather");
var fiveDaysWeatherEl = document.querySelector(".five-day-weather");
var searchButton = document.querySelector(".submit");
var inputValue = document.querySelector(".inputValue");
var currentCity = document.querySelector("#currentCity");
var currentDate = document.querySelector(".current-date")
var historyContainer = document.querySelector(".search-history");
var clearHistoryBtn = document.querySelector(".clearHistory");
var errorBodyEl = document.querySelector(".error");
var APIKey = "424fc59a72d6aabfd6345140f77468d2"
var searchArray = [];
var clearBtn = document.createElement('button'); 

// function to get elements from local storage and render them to the page 
function renderInitialHistory() {
    var storedHistory = JSON.parse(localStorage.getItem('searchHistory'));
    if (storedHistory) {
        searchArray = storedHistory;
    }
    renderHistory();
}
// function to render the search history
document.addEventListener('DOMContentLoaded', renderInitialHistory);

// add event listener to the search button
searchButton.addEventListener("click", handleSearchFormSubmit);


// event handler for search history buttons
function handleSearchHistoryClick(e) {
    // Don't do search if current elements is not a search history button
    if (!e.target.matches('.btn-history')) {
        return;
    }

    var btn = e.target;
    var search = btn.getAttribute('data-search');
    fetchCoords(search);
    console.log("line 38");
}

historyContainer.addEventListener('click', handleSearchHistoryClick);

// Once a button clicked fetch the city name and coordinates
function handleSearchFormSubmit(event) {
    event.preventDefault();
    var searchCity = inputValue.value.trim();
    fetchCoords(searchCity);
    console.log("line 47")
}

// Fetch searched city coordinates from API
function fetchCoords(search) {
    var ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${APIKey}&units=imperial`;
    fetch(ApiUrl).then((res) => {
        return res.json();
    }).then((data) => {
        if (!data) {
            alert('Location is not found');
        } else {
            getWeather(data.name, data.coord);
            // add city to the search history list
            addHistory(data.name);
        }
    }).catch(function (err) {
        console.error(err);
        handleError(err);
        console.log("line 67");
    });

}
// if error occurs, alert the user 
function handleError(err) {
    // create a div element to hold the error message
    var errorEl = document.createElement('div');
    errorEl.setAttribute('class', 'alert alert-danger');
    errorEl.textContent = 'Error! Please check your internet connection or spelling';
    // append the error message to the page
    errorBodyEl.append(errorEl);
    // remove the error message after 3 seconds
    setTimeout(function () {
        errorEl.remove();
    }, 3000);
}


// add history function, stores the searched city to the local storage
function addHistory(cityName) {
    if (searchArray.indexOf(cityName) !== -1) {
        return;
    }
    searchArray.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchArray));
    renderHistory();
}

// Append search input to the current weather element 

function renderHistory() {
    historyContainer.innerHTML = '';
    // create a clear history button and hide it
    
    clearBtn.setAttribute('class', 'btn btn-light btn-clear');
    clearBtn.setAttribute('style', 'display: none');

    clearBtn.textContent = 'Clear History';
    clearHistoryBtn.append(clearBtn);
    // if there is a search history, show the clear history button
    if (searchArray.length > 0) {
        clearBtn.setAttribute('style', 'display: inline-block');
    }

    // add event listener to the clear history button
    clearBtn.addEventListener('click', function () {
        localStorage.clear();
        searchArray = [];
        historyContainer.innerHTML = '';
        clearHistoryBtn.innerHTML = '';
    });

    // loop through the search history array	
    for (var i = searchArray.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('data-search', searchArray[i]);
        // add style to the search history buttons
        btn.setAttribute('class', 'btn btn-secondary btn-block');
        // display buttons on top of each other
        btn.setAttribute('style', 'display: block');
        btn.textContent = searchArray[i];
        historyContainer.append(btn);
    }
}
// add event listener to the search history buttons
historyContainer.addEventListener('click', function (e) {
    if (e.target.matches('button')) {
        var search = e.target.getAttribute('data-search');
        fetchCoords(search);
    }
});


// Function to fetch data from API and render it to the page
function getWeather(city, coord) {
    var { lat, lon } = coord;
    var name = city;
    var ApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
    fetch(ApiUrl).then((res) => {
        return res.json();
    }).then((data) => {
        renderItems(name, data);
    }).catch(function (err) {
        console.error(err);
    });



    // render the current weather and 5 day forecast
    function renderItems(city, data) {
        renderCurrentWeather(city, data.list[0]);
        renderForecast(data.list);
    }

    // get current weather and render it to the page 
    function renderCurrentWeather(city, weather) {
        var date = dayjs().format('M/D/YYYY');
        var temp = weather.main.temp
        var wind = weather.wind
        var humidity = weather.main.humidity
        var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
        var iconDescription = weather.weather[0].description || weather[0].main;

        // Create a card element to hold the current weather
        currentWeatherEl.innerHTML = '';
        var card = document.createElement('div');
        var cardBody = document.createElement('div');
        var heading = document.createElement('h2');
        var icon = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');
        card.setAttribute('class', 'card');
        // cardBody.setAttribute('class', 'card')
        card.append(cardBody);
        heading.textContent = `${city} (${date})`
        icon.setAttribute('src', iconUrl);
        heading.append(icon);
        tempEl.textContent = `Temp: ${temp} ??F`;
        windEl.textContent = `Wind: ${wind.speed} MPH`
        humidityEl.textContent = `Humidity: ${humidity} %`
        cardBody.append(heading, tempEl, windEl, humidityEl)

        currentWeatherEl.append(card)
    }

    // get 5 day forecast and render it to the page 
    function renderForecast(dailyForecast) {
        var startDt = dayjs().add(1, 'day').startOf('day').unix(); // 1 day from now
        var endDt = dayjs().add(6, 'day').startOf('day').unix();  // 6 days from now
        console.log(dailyForecast);
        var headingCol = document.createElement('div');
        var heading = document.createElement('h4');

        headingCol.setAttribute('class', 'col-12');
        heading.textContent = '5-Day Forecast:';
        headingCol.append(heading);

        fiveDaysWeatherEl.innerHTML = '';
        fiveDaysWeatherEl.append(headingCol);

        for (var i = 0; i < dailyForecast.length; i++) {
            // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
            if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
                // Then filters through the data and returns only data captured at noon for each day 
                if (dailyForecast[i].dt_txt.includes("09:00:00")) {
                    // console.log(dailyForecast[i]);
                    renderForecastCard(dailyForecast[i]);
                }
            }
        }
    }
}
// Function to display a forecast card given an object from open weather api 
function renderForecastCard(forecast) {
    // variables for data from api 
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;

    // Create elements for a card to display the forecast 
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-secondary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Add content to elements
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} ??F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    fiveDaysWeatherEl.append(col);
}

