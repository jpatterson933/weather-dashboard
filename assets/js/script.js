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

            //console log our city name so we know where to find it
            //this can be used as the title plug for our cards
            console.log(data.city.name)
            //store city name
            localStorage.setItem("cityName", data.city.name)

            // console log our latitude and longtitude so we know where to find them
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
                    //these are the results for the current day which are kept sepearte form the 
                    //daily results, so we will need to console log and store current weather conditions
                    //we could even have an on click even that stores it on the page until they change it
                    
//----------------------------------------locally store our current day weather condition----------------------------------//
                    console.log("current day")

                    console.log(results.current.dt)
                    localStorage.setItem("currentDate", results.current.dt)

                    console.log(results.current.temp)
                    localStorage.setItem("currentTemp", results.current.temp)

                    console.log(results.current.wind_speed)
                    localStorage.setItem("currentWindSpeed", results.current.wind_speed)

                    console.log(results.current.humidity)
                    localStorage.setItem("currentHumidity", results.current.humidity)

                    console.log(results.current.uvi)
                    localStorage.setItem("currentUvi", results.current.uvi)

                    console.log(results.current.weather[0].main)
                    localStorage.setItem("currentConditions", results.current.weather[0].main)

                    console.log(results.current.weather[0].icon)
                    localStorage.setItem("currentConditionsImg", results.current.weather[0].icon)

                    console.log(results.current.sunset)
                    localStorage.setItem("currentSunset", results.current.sunset)

                    console.log(results.current.sunrise)
                    localStorage.setItem("currentSunrise", results.current.sunrise)

                    console.log("end current day info")

                    //empty variables that will be used to store each of our five days information into local storage
                    var dateStr = ' ';
                    var tempMaxStr = ' ';
                    var tempMinStr = ' ';
                    var windSpeedStr = ' ';
                    var humidityStr = ' ';
                    var uviStr = ' ';
                    var weatherConditionMainStr = ' ';
                    var weatherConditionIconStr = ' ';
                    var sunriseStr = ' ';
                    var sunsetStr = ' ';
                    
                    //loops through our daily weather reports for the next five days
                    for (var i = 1; i < 6; i++) {
                        
                        //console log to track each new day through loops
                        console.log("new day")
                        //console log our date
                        console.log(results.daily[i].dt)
                        
                        //date string
                        dateStr += results.daily[i].dt + ", ";
                        console.log(dateStr)
                        localStorage.setItem("dailyDate", dateStr)
                     
                        //console log our max temp
                        console.log(results.daily[i].temp.max)

                        //max temp string
                        tempMaxStr += results.daily[i].temp.max + ", ";
                        localStorage.setItem("dailyTempMax", tempMaxStr)

                        //console log our min temp
                        console.log(results.daily[i].temp.min)

                        //temp min string
                        tempMinStr += results.daily[i].temp.min + ", ";
                        localStorage.setItem("dailyTempMin", tempMinStr)

                        //console log our humidity
                        console.log(results.daily[i].wind_speed)

                        windSpeedStr += results.daily[i].wind_speed + ", ";
                        localStorage.setItem("dailyWindSpeed", windSpeedStr)
                        //console log our humidity - this can be translated to percentage to represent total humidty in the air. (eg. 49 means humidity is 49%)
                        console.log(results.daily[i].humidity)
                        //console log our uvi
                        //I will need to create  uvi function
                        console.log(results.daily[i].uvi)
                        //console log weather conditions report string
                        //i could go further and loop throug the weather array or just set it to 0
                        console.log(results.daily[i].weather[0].main)
                        console.log(results.daily[i].weather[0].icon)
                        //console log our sunrise time
                        console.log(results.daily[i].sunrise)
                        //console log our sunet time
                        console.log(results.daily[i].sunset) 
                    }
                })
        })
})






//use momement to parse into the sunrise and sunset time


