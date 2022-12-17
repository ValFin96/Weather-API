var searchButton = document.querySlector(".submit");
var inputValue = document.querySlector(".inputValue");

fetch("https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}")