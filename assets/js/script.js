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
            if (response.status === 404) {
                //replace this with a modal
                $("#invalid-city").show()
            }
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
            localStorage.setItem("latitude", data.city.coord.lat)
            console.log(data.city.coord.lon);
            localStorage.setItem("longitude", data.city.coord.lon);

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

//----------------------------locally store a five day weather forecast----------------------------------//
                    //loops through our daily weather reports for the next five days
                    for (var i = 1; i < 6; i++) {
                        
                        //date string
                        dateStr += results.daily[i].dt + ", ";
                        localStorage.setItem("dailyDate", dateStr)

                        //temp max string
                        tempMaxStr += results.daily[i].temp.max + ", ";
                        localStorage.setItem("dailyTempMax", tempMaxStr)

                        //temp min string
                        tempMinStr += results.daily[i].temp.min + ", ";
                        localStorage.setItem("dailyTempMin", tempMinStr)

                        //wind speed string
                        windSpeedStr += results.daily[i].wind_speed + ", ";
                        localStorage.setItem("dailyWindSpeed", windSpeedStr)

                        //humidity string
                        humidityStr += results.daily[i].humidity + ", ";
                        localStorage.setItem("dailyHumidity", humidityStr)

                        //uvi string
                        uviStr += results.daily[i].uvi + ", ";
                        localStorage.setItem("dailyUvi", uviStr);

                        //weather condition main string
                        weatherConditionMainStr += results.daily[i].weather[0].main + ", ";
                        localStorage.setItem("dailyConditionMain", weatherConditionMainStr)

                        //weather condition icon string
                        weatherConditionIconStr += results.daily[i].weather[0].icon + ", ";
                        localStorage.setItem("dailyConditionImg", weatherConditionIconStr)

                        //sunrise string
                        sunriseStr += results.daily[i].sunrise + ", ";
                        localStorage.setItem("dailySunrise", sunriseStr);

                        //sunset string
                        sunsetStr += results.daily[i].sunset + ", ";
                        localStorage.setItem("dailySunset", sunsetStr)
                    }
                    location.reload()
                })
        })
})

var dateStr = localStorage.getItem("dailyDate").split(",");
var tempMaxStr = localStorage.getItem("dailyTempMax").split(",");
var tempMinStr = localStorage.getItem("dailyTempMin").split(",");
var windSpeedStr = localStorage.getItem("dailyWindSpeed").split(",");
var humidityStr = localStorage.getItem("dailyHumidity").split(",");
var uviStr = localStorage.getItem("dailyUvi").split(",");
var weatherConditionMainStr = localStorage.getItem("dailyConditionMain").split(",");
var weatherConditionIconStr = localStorage.getItem("dailyConditionImg").split(",");


//variables for displaying card information
var currentDayDisplay = $("#current-day");
var dayOne = $("#one-day");
var dayTwo = $("#two-day");
var dayThree = $("#three-day");
var dayFour = $("#four-day");
var dayFive = $("#five-day");
var savedCity = $("#saved-city")
// City Name remains global
var cityNameGlobal =  localStorage.getItem("cityName");



//function for grabbing locally stored current day information and displaying that info in card on browswer
function currentDay () {
    //we will stringify and store this object so it can be added to local storage later
    //and added into our "search history" // not sure how I am going to create that yet
    currentDayForecast = {
        cityName: localStorage.getItem("cityName"),
        latitude: localStorage.getItem("latitude").trim(),
        longitude: localStorage.getItem("longitude").trim(),
        date: localStorage.getItem("currentDate").trim(),
        temp: localStorage.getItem("currentTemp").trim(),
        windSpeed: localStorage.getItem("currentWindSpeed").trim(),
        humidity: localStorage.getItem("currentHumidity").trim(),
        uvi: localStorage.getItem("currentUvi").trim(),
        conditions: localStorage.getItem("currentConditions").trim(),
        conditionImg: localStorage.getItem("currentConditionsImg").trim(),
    }

   

    //change temperature to fahrenheit 
    var fahrenTemp = Math.round((currentDayForecast.temp - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = currentDayForecast.date
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var date = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = currentDayForecast.uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row floor-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<button id='save-current-city'>Save City</button>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + currentDayForecast.conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(currentDayForecast.cityName);
    displayDate.text(date);
    displayTemp.text("Currently " + fahrenTemp + "\u00B0" + "F")
    displayWind.text("Wind Speed " + currentDayForecast.windSpeed + " mph");
    displayHumidity.text("Humidity " + currentDayForecast.humidity + "%");
    displayUvi.text("UV Index " + currentDayForecast.uvi);
    displayConditions.text(currentDayForecast.conditions);
    displayConditionImg.text(currentDayForecast.conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow1.append(displayTemp);
    displayRow2.append(displayConditions);
    displayRow2.append(displayConditionImg);
    displayRow3.append(displayWind);
    displayRow4.append(displayUvi);
    displayRow4.append(uviColor)
    displayRow5.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    currentDayDisplay.append(displayColumn1)
    $("#save-current-city").on("click", function () {
        localStorage.setItem("savedCity", JSON.stringify(currentDayForecast))
    })
}

function oneDay () {

    var newDate = dateStr[0].trim();
    var tempMax = tempMaxStr[0].trim();
    var tempMin = tempMinStr[0].trim();
    var windSpeed = windSpeedStr[0].trim();
    var humidity = humidityStr[0].trim();
    var uvi = uviStr[0].trim();
    var conditions = weatherConditionMainStr[0].trim();
    var conditionImg = weatherConditionIconStr[0].trim();


  
    
    //we will stringify and store this object so it can be added to local storage later
    //and added into our "search history" // not sure how I am going to create that yet
    

    //max and min temperature in fahrenheit
    var fahrenTempMax = Math.round((tempMax - 273.15) * (9/5) + 32)
    var fahrenTempMin = Math.round((tempMin - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = newDate;
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var oneDate = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<div class='row base-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayMaxTemp = $("<p></p>");
    var displayMinTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(cityNameGlobal);
    displayDate.text(oneDate);
    displayMaxTemp.text("Max Temp " + fahrenTempMax + "\u00B0" + "F")
    displayMinTemp.text("Min Temp " + fahrenTempMin + "\u00B0" + "F")
    displayWind.text("Wind Speed " + windSpeed + " mph");
    displayHumidity.text("Humidity " + humidity + "%");
    displayUvi.text("UV Index " + uvi);
    displayConditions.text(conditions);
    displayConditionImg.text(conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow2.append(displayMaxTemp);
    displayRow2.append(displayMinTemp);
    displayRow3.append(displayConditions);
    displayRow3.append(displayConditionImg);
    displayRow4.append(displayWind);
    displayRow5.append(displayUvi);
    displayRow5.append(uviColor)
    displayRow6.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    dayOne.append(displayColumn1)
}

function twoDay () {

    var newDate = dateStr[1].trim();
    var tempMax = tempMaxStr[1].trim();
    var tempMin = tempMinStr[1].trim();
    var windSpeed = windSpeedStr[1].trim();
    var humidity = humidityStr[1].trim();
    var uvi = uviStr[1].trim();
    var conditions = weatherConditionMainStr[1].trim();
    var conditionImg = weatherConditionIconStr[1].trim();

    

    //max and min temperature in fahrenheit
    var fahrenTempMax = Math.round((tempMax - 273.15) * (9/5) + 32)
    var fahrenTempMin = Math.round((tempMin - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = newDate;
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var oneDate = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<div class='row base-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayMaxTemp = $("<p></p>");
    var displayMinTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(cityNameGlobal);
    displayDate.text(oneDate);
    displayMaxTemp.text("Max Temp " + fahrenTempMax + "\u00B0" + "F")
    displayMinTemp.text("Min Temp " + fahrenTempMin + "\u00B0" + "F")
    displayWind.text("Wind Speed " + windSpeed + " mph");
    displayHumidity.text("Humidity " + humidity + "%");
    displayUvi.text("UV Index " + uvi);
    displayConditions.text(conditions);
    displayConditionImg.text(conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow2.append(displayMaxTemp);
    displayRow2.append(displayMinTemp);
    displayRow3.append(displayConditions);
    displayRow3.append(displayConditionImg);
    displayRow4.append(displayWind);
    displayRow5.append(displayUvi);
    displayRow5.append(uviColor)
    displayRow6.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    dayTwo.append(displayColumn1)
}

function threeDay () {

    var newDate = dateStr[2].trim();
    var tempMax = tempMaxStr[2].trim();
    var tempMin = tempMinStr[2].trim();
    var windSpeed = windSpeedStr[2].trim();
    var humidity = humidityStr[2].trim();
    var uvi = uviStr[2].trim();
    var conditions = weatherConditionMainStr[2].trim();
    var conditionImg = weatherConditionIconStr[2].trim();

    

    //max and min temperature in fahrenheit
    var fahrenTempMax = Math.round((tempMax - 273.15) * (9/5) + 32)
    var fahrenTempMin = Math.round((tempMin - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = newDate;
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var oneDate = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<div class='row base-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayMaxTemp = $("<p></p>");
    var displayMinTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(cityNameGlobal);
    displayDate.text(oneDate);
    displayMaxTemp.text("Max Temp " + fahrenTempMax + "\u00B0" + "F")
    displayMinTemp.text("Min Temp " + fahrenTempMin + "\u00B0" + "F")
    displayWind.text("Wind Speed " + windSpeed + " mph");
    displayHumidity.text("Humidity " + humidity + "%");
    displayUvi.text("UV Index " + uvi);
    displayConditions.text(conditions);
    displayConditionImg.text(conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow2.append(displayMaxTemp);
    displayRow2.append(displayMinTemp);
    displayRow3.append(displayConditions);
    displayRow3.append(displayConditionImg);
    displayRow4.append(displayWind);
    displayRow5.append(displayUvi);
    displayRow5.append(uviColor)
    displayRow6.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    dayThree.append(displayColumn1)
}

function fourDay () {

    var newDate = dateStr[3].trim();
    var tempMax = tempMaxStr[3].trim();
    var tempMin = tempMinStr[3].trim();
    var windSpeed = windSpeedStr[3].trim();
    var humidity = humidityStr[3].trim();
    var uvi = uviStr[3].trim();
    var conditions = weatherConditionMainStr[3].trim();
    var conditionImg = weatherConditionIconStr[3].trim();

    

    //max and min temperature in fahrenheit
    var fahrenTempMax = Math.round((tempMax - 273.15) * (9/5) + 32)
    var fahrenTempMin = Math.round((tempMin - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = newDate;
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var oneDate = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<div class='row base-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayMaxTemp = $("<p></p>");
    var displayMinTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(cityNameGlobal);
    displayDate.text(oneDate);
    displayMaxTemp.text("Max Temp " + fahrenTempMax + "\u00B0" + "F")
    displayMinTemp.text("Min Temp " + fahrenTempMin + "\u00B0" + "F")
    displayWind.text("Wind Speed " + windSpeed + " mph");
    displayHumidity.text("Humidity " + humidity + "%");
    displayUvi.text("UV Index " + uvi);
    displayConditions.text(conditions);
    displayConditionImg.text(conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow2.append(displayMaxTemp);
    displayRow2.append(displayMinTemp);
    displayRow3.append(displayConditions);
    displayRow3.append(displayConditionImg);
    displayRow4.append(displayWind);
    displayRow5.append(displayUvi);
    displayRow5.append(uviColor)
    displayRow6.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    dayFour.append(displayColumn1)
}

function fiveDay () {

    var newDate = dateStr[4].trim();
    var tempMax = tempMaxStr[4].trim();
    var tempMin = tempMinStr[4].trim();
    var windSpeed = windSpeedStr[4].trim();
    var humidity = humidityStr[4].trim();
    var uvi = uviStr[4].trim();
    var conditions = weatherConditionMainStr[4].trim();
    var conditionImg = weatherConditionIconStr[4].trim();

    

    //max and min temperature in fahrenheit
    var fahrenTempMax = Math.round((tempMax - 273.15) * (9/5) + 32)
    var fahrenTempMin = Math.round((tempMin - 273.15) * (9/5) + 32)
    

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = newDate;
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var oneDate = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;

    //uvi variable
    var uviColor = uvi;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    var displayRow4 = $("<div class='row floor-row-design'></div>");
    var displayRow5 = $("<div class='row base-row-design'></div>");
    var displayRow6 = $("<div class='row base-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayMaxTemp = $("<p></p>");
    var displayMinTemp = $("<p></p>");
    var displayWind = $("<p></p>");
    var displayHumidity = $("<p></p>");
    var displayUvi = $("<p></p>");
    var displayConditions = $("<p></p>");
    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    
    //if statements that change my box color based off uvi
    if (uviColor < 3) {
        uviColor = $("<div id='uvi-color' style='background-color: green'></div>")
    }
    if (uviColor > 2 && uviColor < 6) {
        uviColor = $("<div id='uvi-color' style='background-color: yellow'></div>")
    }
    if (uviColor > 5 && uviColor < 8) {
        uviColor = $("<div id='uvi-color' style='background-color: orange'></div>")
    }
    if (uviColor > 7 && uvicolor < 11) {
        uviColor = $("<div id='uvi-color' style='background-color: red'></div>")
    }
    if (uviColor > 11) {
        uviColor = $("<div id='uvi-color' style='background-color: purple'></div>")
    }
    
    //insert text into variables that hold html elements
    displayCity.text(cityNameGlobal);
    displayDate.text(oneDate);
    displayMaxTemp.text("Max Temp " + fahrenTempMax + "\u00B0" + "F")
    displayMinTemp.text("Min Temp " + fahrenTempMin + "\u00B0" + "F")
    displayWind.text("Wind Speed " + windSpeed + " mph");
    displayHumidity.text("Humidity " + humidity + "%");
    displayUvi.text("UV Index " + uvi);
    displayConditions.text(conditions);
    displayConditionImg.text(conditionImg);
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow2.append(displayMaxTemp);
    displayRow2.append(displayMinTemp);
    displayRow3.append(displayConditions);
    displayRow3.append(displayConditionImg);
    displayRow4.append(displayWind);
    displayRow5.append(displayUvi);
    displayRow5.append(uviColor)
    displayRow6.append(displayHumidity);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3);
    displayColumn1.append(displayRow4);
    displayColumn1.append(displayRow5);
    displayColumn1.append(displayRow6);
    dayFive.append(displayColumn1)
}

function showStoredCity () {
    //pulling stored city information and storing it into a variable
    var storedCity = JSON.parse(localStorage.getItem("savedCity"))
    //displaying temperature as fahrenheit
    var fahrenTemp = Math.round((storedCity.temp - 273.15) * (9/5) + 32)

    //converetd unixtimestamp into a readable date formate
    var unixTimeStamp = storedCity.date
    var milliseconds = unixTimeStamp * 1000
    var dateObject = new Date(milliseconds)
    var readableDate = {
        day: dateObject.toLocaleString("en-US", {weekday: "long"}),
        month: dateObject.toLocaleString("en-US", {month: "long"}),
        dayNum: dateObject.toLocaleString("en-US", {day: "numeric"})
    }
    //combines my readable date into a single string that will be displayed on the card
    var date = readableDate.day + " " + readableDate.month + " " + readableDate.dayNum;
    
    //creat columns and rose here to append html elements
    var displayColumn1 = $("<div class='col card-design'></div>");
    var displayRow1 = $("<div class='row top-row-design'></div>");
    var displayRow2 = $("<div class='row mid-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayTemp = $("<p></p>");
    var displayConditions = $("<p></p>");
    var grabButton = $("<button id='show-forecast'></button>")

    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + storedCity.conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    //insert text into variables that hold html elements
    displayCity.text(storedCity.cityName);
    displayDate.text(date);
    displayTemp.text("Currently " + fahrenTemp + "\u00B0" + "F")
    displayConditions.text(storedCity.conditions);
    displayConditionImg.text(storedCity.conditionImg);
    grabButton.text("Show Forecast");
    
    //append our html elements that hold text into the three rows, 
    //then the column, then the carddisplay element in html
    displayRow1.append(displayCity);
    displayRow1.append(displayDate);
    displayRow1.append(displayTemp);
    displayRow2.append(displayConditions);
    displayRow2.append(displayConditionImg);
    displayRow2.append(grabButton);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    savedCity.append(displayColumn1)


    //pull and store lat and lon to potentially display the current city and five day forecasts on click of stored city
    var latitude = localStorage.getItem("latitude")
    var longitude = localStorage.getItem("longitude")
    console.log(latitude)
    console.log(longitude)

    var query2 = forecastUrl + "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely" + apiKey;


    console.log(query2)
    $("#show-forecast").on("click", function () {
        fetch(query2)
          .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (results) {
            console.log(results)
            currentDayForecast = {
                cityName: localStorage.getItem("cityName"),
                latitude: localStorage.getItem("latitude").trim(),
                longitude: localStorage.getItem("longitude").trim(),
                date: localStorage.getItem("currentDate").trim(),
                temp: localStorage.getItem("currentTemp").trim(),
                windSpeed: localStorage.getItem("currentWindSpeed").trim(),
                humidity: localStorage.getItem("currentHumidity").trim(),
                uvi: localStorage.getItem("currentUvi").trim(),
                conditions: localStorage.getItem("currentConditions").trim(),
                conditionImg: localStorage.getItem("currentConditionsImg").trim(),
            }

            //on click this will change local storage, reload the page, and displayed there stored citys forecast
            localStorage.setItem("cityName", storedCity.cityName)
            localStorage.setItem("currentDate", storedCity.date)
            localStorage.setItem("currentTemp", storedCity.temp)
            localStorage.setItem("currentWindSpeed", storedCity.windSpeed)
            localStorage.setItem("currentHumidity", storedCity.humidity)
            localStorage.setItem("currentUvi", storedCity.uvi)
            localStorage.setItem("currentConditions", storedCity.conditions)
            localStorage.setItem("currentConditionsImg", storedCity.conditionImg)



            location.reload()



                
        })

      })
}

//run our current day function which basically pulls data from local storage and displays
//this display happens here when the search button is clicked and the page reloads
showStoredCity()
currentDay()
oneDay()
twoDay()
threeDay()
fourDay()
fiveDay()



