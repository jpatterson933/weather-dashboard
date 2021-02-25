var searchButton = $("#button-search");

var baseUrl = "http://api.openweathermap.org/data/2.5/forecast?&q="
var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={latgoeshere}&lon={longgoeshere}&exclude={morestuff}.&appid={apikeygoeshere}";
var apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195"



$("#button-search").on("click", function (event) {
    event.preventDefault();


    var cityName = $("#city-name").val().trim();

    let query = baseUrl + cityName + apiKey;

    
    fetch(query)
        .then(function (response) {
            return response.json();
           
        })
        .then(function (data) {

            console.log(data)

            console.log(data.city.coord.lat);
            console.log(data.city.coord.lon);

            //make the next url include the lat and lon to create the forecast url
            let query = forecastUrl + data.city.coord.lat + data.city.coord.lon + apiKey;
            
            
            // this for loop can be used when you run it through the daily forcast api
            // for (var i = 0; i < data.list.length; i++) {
            //     console.log(data.list[i].dt_txt);
            //     console.log(data.list[i].main.temp);
            //     console.log(data.list[i].main.humidity);
            //     console.log(data.list[i].wind.speed);

            //     console.log(data.list[i].main.feels_like);
    
    
            // }
    
        })
})







//use momement to parse into the sunrise and sunset time


