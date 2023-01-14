var currentWeatherEl = document.querySelector(".current-weather");
var fiveDaysWeatherEl = document.querySelector(".five-day-weather");
var searchButton = document.querySelector(".submit");
var inputValue = document.querySelector(".inputValue");
var currentCity = document.querySelector("#currentCity");
var currentDate = document.querySelector(".current-date")
var historyContainer = document.querySelector(".search-history");
var errorBodyEl = document.querySelector(".error");
var APIKey = "424fc59a72d6aabfd6345140f77468d2"
var searchArray = [];

renderInitialHistory();
searchButton.addEventListener("click", handleSearchFormSubmit);

// function handleSearchHistoryClick(e) {
//     // Don't do search if current elements is not a search history button
//     if (!e.target.matches('.btn-history')) {
//         return;
//     }

//     var btn = e.target;
//     var search = btn.getAttribute('data-search');
//     fetchCoords(search);
// }

// historyContainer.addEventListener('click', handleSearchHistoryClick);

// Once a button clicked fetch the city name and coordinates
function handleSearchFormSubmit(event) {
    event.preventDefault();
    var searchCity = inputValue.value.trim();
    fetchCoords(searchCity);
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
    });

}
// if error occurs, alert the user 
function handleError(err) {
    // create a div element to hold the error message
    var errorEl = document.createElement('div');
    errorEl.setAttribute('class', 'alert alert-danger');
    errorEl.textContent = 'Unable to connect! Please search again.';
    // append the error message to the page
    errorBodyEl.append(errorEl);
    // remove the error message after 3 seconds
    setTimeout(function () {
        errorEl.remove();
    }, 3000);
}


// add history function, stores the searched city to the local storage
function addHistory(cityName){
    if(searchArray.indexOf(cityName) !== -1){
        return;
    }
    searchArray.push(cityName);
    localStorage.setItem('searchHistory', searchArray);
    renderHistory();
}
// Append search input to the current weather element 
function renderHistory(){
    historyContainer.innerHTML = '';
    for(var i = searchArray.length -1; i>=0; i--){
        var btn = document.createElement('button');
        btn.setAttribute('data-search', searchArray[i]);
        btn.textContent = searchArray[i];
        historyContainer.append(btn);
    }
}
// gets the history from local storage
function renderInitialHistory(){
    var storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory){
        // searchArray = JSON.parse(storedHistory);
    }
    renderHistory();
}
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
        handleError(err);	
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
        cardBody.setAttribute('class', 'card')
        card.append(cardBody);
        heading.textContent = `${city} (${date})`
        icon.setAttribute('src', iconUrl);
        heading.append(icon);
        tempEl.textContent = `Temp: ${temp}`;
        windEl.textContent = `Wind: ${wind.speed}` 
        humidityEl.textContent = `Humidity: ${humidity}`
        cardBody.append(heading, tempEl, windEl, humidityEl)

        currentWeatherEl.append(card)
    }

// get 5 day forecast and render it to the page 
    function renderForecast(dailyForecast) {
        var startDt = dayjs().add(1,'day').startOf('day').unix();
        var endDt = dayjs().add(7,'day').startOf('day').unix();
        // console.log(dailyForecast)
        // console.log(startDt, endDt);
        
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
                if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
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
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Add content to elements
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

   fiveDaysWeatherEl.append(col);


    // get variables temp humidity 


    // create elements for a card

    // append all elements to each other, set attributes

    // add textcontent to all elemments and appensd to the main container
}

    // function to update history in local storage, then update display history
    // check if the search item is in the array
    // renderHistoryFunction - if you the city already exists in array creating buttons




    // currentDate.textContent = dayjs().format('DD/MM/YYYY');
    // fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=" + APIKey)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data);
    //         for (i=0; i<5; i++){
    //           document.getElementById('tempDay' + (i+1)).innerHTML = "Temp: " + data.list[i].main.temp
    //         }
    //         for (i=0; i<5; i++){
    //             document.getElementById('humidityDay' + (i+1)).innerHTML = "Humidity: " + data.list[i].main.humidity
    //           }
    //           for (i=0; i<5; i++){
    //             document.getElementById('windDay' + (i+1)).innerHTML = "Wind: " + data.list[i].wind.speed
    //           }
    //     })
// }

