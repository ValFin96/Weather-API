var searchButton = $(".submit");
var inputValue = $(".inputValue");

$(document).ready(function(){
   searchButton.on("click",function (event) {
    var userInput = inputValue.val().trim();
    console.log(userInput)
   }) 
})
var APIKey = "424fc59a72d6aabfd6345140f77468d2"
function getWeather() {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=424fc59a72d6aabfd6345140f77468d2")
        .then((response) => response.json())
        .then((data) => console.log(data))
}
