var searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
var baseUrl = "http://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
//this is my api key
var apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195"


//when the user clicks this button, it will run the events for the pages
$("#button-search").on("click", function (event) {
    event.preventDefault();
    //this variable is the input from the user and trims all white spaces
    var cityName = $("#city-name").val().trim();
    //this is our inital url that we are using fetch with to gather the lon and lat of cities
    let query = baseUrl + cityName + apiKey;

    //first fetch that pulls lat and lon locations of cities
    fetch(query)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //console log information so we can see whats going on
            console.log(data)
            console.log(data.city.coord.lat);
            console.log(data.city.coord.lon);

            //make the next url include the lat and lon to create the forecast url -- we also exclude hourly and minutely data so we only get daily
            let query2 = forecastUrl + "lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon + "&exclude=hourly,minutely" + apiKey;
            
            ///console log query2 so we what our url looks like so we know what fetch will be using
            console.log(query2);

            //our second fetch grabbing the data from our new url
            fetch(query2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (results) {


                    //console.log our results from the new url so we can the further refine our weather program
                    console.log(results)


                })


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


