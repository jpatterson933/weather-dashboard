var searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
var baseUrl = "http://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
//this is my api key
var apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195"

//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
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
                alert("Please enter a valid city name!")
            }
            return response.json();
        })
        .then(function (data) {

            //store city name
            localStorage.setItem("cityName", data.city.name)
            
            //store our latitude and longitude
            localStorage.setItem("latitude", data.city.coord.lat)
            localStorage.setItem("longitude", data.city.coord.lon);

            //make the next url include the lat and lon to create the forecast url -- we also exclude hourly and minutely data so we only get daily
            let query2 = forecastUrl + "lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon + "&exclude=hourly,minutely" + apiKey;

            //our second fetch grabbing the data from our new url created at query2
            fetch(query2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (results) {
                    
//----------------------------------------locally store our current day weather condition----------------------------------//

                    //store all current day data into local storage//
                    localStorage.setItem("currentDate", results.current.dt)
                    localStorage.setItem("currentTemp", results.current.temp)
                    localStorage.setItem("currentWindSpeed", results.current.wind_speed)
                    localStorage.setItem("currentHumidity", results.current.humidity)
                    localStorage.setItem("currentUvi", results.current.uvi)
                    localStorage.setItem("currentConditions", results.current.weather[0].main)
                    localStorage.setItem("currentConditionsImg", results.current.weather[0].icon)

                    //empty variables that will be used to store each of our five days information into local storage
                    var dateStr = ' ';
                    var tempMaxStr = ' ';
                    var tempMinStr = ' ';
                    var windSpeedStr = ' ';
                    var humidityStr = ' ';
                    var uviStr = ' ';
                    var weatherConditionMainStr = ' ';
                    var weatherConditionIconStr = ' ';

//----------------------------locally store a five day weather forecast using loop----------------------//
                    //loops through our daily weather reports for the next five days
                    for (var i = 1; i < 6; i++) {
                        
                        //create date string and store
                        dateStr += results.daily[i].dt + ", ";
                        localStorage.setItem("dailyDate", dateStr)

                        //create temp max string and store
                        tempMaxStr += results.daily[i].temp.max + ", ";
                        localStorage.setItem("dailyTempMax", tempMaxStr)

                        //create temp min string and store
                        tempMinStr += results.daily[i].temp.min + ", ";
                        localStorage.setItem("dailyTempMin", tempMinStr)

                        //create wind speed string and store
                        windSpeedStr += results.daily[i].wind_speed + ", ";
                        localStorage.setItem("dailyWindSpeed", windSpeedStr)

                        //create humidity string and store
                        humidityStr += results.daily[i].humidity + ", ";
                        localStorage.setItem("dailyHumidity", humidityStr)

                        //create uvi string and store
                        uviStr += results.daily[i].uvi + ", ";
                        localStorage.setItem("dailyUvi", uviStr);

                        //create weather condition string and store
                        weatherConditionMainStr += results.daily[i].weather[0].main + ", ";
                        localStorage.setItem("dailyConditionMain", weatherConditionMainStr)

                        //create weather condition icon code string and store
                        weatherConditionIconStr += results.daily[i].weather[0].icon + ", ";
                        localStorage.setItem("dailyConditionImg", weatherConditionIconStr)
                    }
                    //reload page on clik to display newly stored information
                    location.reload()
                })
        })
})

//An error will populate here that says i cannot split null. I am very very unsure how to fix - code still works once city is inputted.
var dateStr = localStorage.getItem("dailyDate").split(",");
var tempMaxStr = localStorage.getItem("dailyTempMax").split(",");
var tempMinStr = localStorage.getItem("dailyTempMin").split(",");
var windSpeedStr = localStorage.getItem("dailyWindSpeed").split(",");
var humidityStr = localStorage.getItem("dailyHumidity").split(",");
var uviStr = localStorage.getItem("dailyUvi").split(",");
var weatherConditionMainStr = localStorage.getItem("dailyConditionMain").split(",");
var weatherConditionIconStr = localStorage.getItem("dailyConditionImg").split(",");

//variables for grabbing html elements to be used in displaying card data
var currentDayDisplay = $("#current-day");
var dayOne = $("#one-day");
var dayTwo = $("#two-day");
var dayThree = $("#three-day");
var dayFour = $("#four-day");
var dayFive = $("#five-day");
var savedCity = $("#saved-city")
var savedTitle = $("#saved-title")
var todayTitle = $("#today-title")
var cityNameGlobal =  localStorage.getItem("cityName");

//function for grabbing locally stored current day information and displaying that info in card on browswer
function currentDay () {

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
    
    //converetd unixtimestamp into a readable date format
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
    var title = $("<h1></h1>");
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
    title.text("Today's Weather Stats")
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
    title.append(displayColumn1)
    todayTitle.append(title)
    currentDayDisplay.append(todayTitle)
    currentDayDisplay.append(displayColumn1)

    //save current city into local storage
    $("#save-current-city").on("click", function () {
        localStorage.setItem("savedCity", JSON.stringify(currentDayForecast))
        location.reload()
    })
}
//---I REALIZED LATER I COULD HAVE LOOPED THROUGH INSTEAD OF CREATING 5 FUNCTIONS FOR EACH DAY :( ---//
function oneDay () {

    var newDate = dateStr[0].trim();
    var tempMax = tempMaxStr[0].trim();
    var tempMin = tempMinStr[0].trim();
    var windSpeed = windSpeedStr[0].trim();
    var humidity = humidityStr[0].trim();
    var uvi = uviStr[0].trim();
    var conditions = weatherConditionMainStr[0].trim();
    var conditionImg = weatherConditionIconStr[0].trim(); 

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
    console.log(fahrenTemp)
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
    var displayRow3 = $("<div class='row mid-row-design'></div>");
    
    //creat html elements for each object in currendDayForecast
    var title = $("<h1></h1>");
    var displayCity = $("<p class='city-name'></p>");
    var displayDate = $("<p></p>");
    var displayTemp = $("<p></p>");
    var displayConditions = $("<p></p>");
    var grabButton = $("<button id='show-forecast'></button>")

    //will pull corresponding image depending upon weather conditions (if clear during day, will show sun with no clouds)
    var displayConditionImg = $("<img src='http://openweathermap.org/img/wn/" + storedCity.conditionImg + "@2x.png' alt='Weather Condition Image'>");
    
    //insert text into variables that hold html elements
    title.text("Your Saved City");
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
    displayRow3.append(grabButton);
    displayColumn1.append(displayRow1)
    displayColumn1.append(displayRow2)
    displayColumn1.append(displayRow3)
    title.append(displayColumn1)
    savedTitle.append(title)
    savedCity.append(displayColumn1)
    savedTitle.append(savedCity)

    //pull and store lat and lon to potentially display the current city and five day forecasts on click of stored city
    var latitude = localStorage.getItem("latitude")
    var longitude = localStorage.getItem("longitude")
    console.log(latitude)
    console.log(longitude)

    //new query  ased off of stored city latitutde and longitude
    var query2 = forecastUrl + "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely" + apiKey;

    //on click event to reload our stored data from the saved button and display it on the page
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

            //reload on click
            location.reload() 
        })
      })
}

//Our display cards
currentDay()
oneDay()
twoDay()
threeDay()
fourDay()
fiveDay()

showStoredCity()


