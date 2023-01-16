# Weather-API

## Description

A Weather dashboard that allow users search for weather forecast anywhere in the world using Openweather API. The weather dashboard displays current weather data along with the 5-day forecast for this particular city. Users searches are stored in the local storage and retrieved every time users come back to the application.
[Link to the deployed application](https://valfin96.github.io/Weather-API/)

## How it works

Step 1: A user is presented with a search bar and a prompt to search for a city for the first time a user loads the application.
![Screenshot](./assets/images/Weather%20screenshot%202.jpg)

Step 2: Once a user inputs a city and click "Search", a user is presented with a current a\day weather forecast and next 5-days weather forecast.
![Screenshot](./assets/images/Weather%20screenshot%201.jpg)

Step 3: If a user exits the application and comes back to it later, all previous searches are displayed in a button that pulls weather data without typing the city name again. A last search will be displayed in the first button from the top.
![Screenshot](./assets/images/Weather%20screenshot%203.jpg)

## How it's built

The code is built using JQuery, DayJS, Bootstrap, Javascript, HTML and CSS. User's input saved in local storage and retrieved it every time user comes back to the application.
