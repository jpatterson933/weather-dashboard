let searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
let baseUrl = "https://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
//this is my api key
let apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195"



//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
$("#button-search").on("click", function (event) {
    event.preventDefault();

    // searched city from user
    let cityName = $("#city-name").val().trim();

    //this is our inital url that we are using fetch with to gather the lon and lat of cities
    let query = baseUrl + cityName + apiKey;

    //first fetch that pulls lat and lon locations of cities
    fetch(query)
        .then(function (response) {
            if (response.status === 404) {
                // alert if the city entered does not exist
                alert("Please enter a valid city name!")
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data.city)
            //store city name, latitude and longtitude respectively
            localStorage.setItem("country", data.city.country)
            localStorage.setItem("cityName", data.city.name)
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


                    console.log(results)
                    //--------------locally store our current day weather condition--------------//
                    localStorage.setItem("currentDate", results.current.dt)
                    localStorage.setItem("currentTemp", results.current.temp)
                    localStorage.setItem("currentWindSpeed", results.current.wind_speed)
                    localStorage.setItem("currentHumidity", results.current.humidity)
                    localStorage.setItem("currentUvi", results.current.uvi)
                    localStorage.setItem("currentConditions", results.current.weather[0].main)
                    localStorage.setItem("currentConditionsImg", results.current.weather[0].icon)

                    //empty variables that will be used to store each of our five days information into local storage
                    let dateStr = ' ';
                    let tempMaxStr = ' ';
                    let tempMinStr = ' ';
                    let windSpeedStr = ' ';
                    let humidityStr = ' ';
                    let uviStr = ' ';
                    let weatherConditionMainStr = ' ';
                    let weatherConditionIconStr = ' ';

                    //----------------------------locally store a five day weather forecast using loop----------------------//
                    for (let i = 1; i < 6; i++) {

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
                    //reload page on click to display newly stored information
                    location.reload()
                })
        })
})

// City Name being searched - used in multiple functions
let cityNameGlobal = localStorage.getItem("cityName");

// function for color coded uv index
function uviColorDisplay(uviColor) {
    if (uviColor < 3) {
        return color = "<div id='uvi-color' style='background-color: green'></div>";
    }
    if (uviColor > 2 && uviColor < 6) {
        return color = "<div id='uvi-color' style='background-color: yellow'></div>"
    }
    if (uviColor > 5 && uviColor < 8) {
        return color = "<div id='uvi-color' style='background-color: orange'></div>"
    }
    if (uviColor > 7 && uviColor < 11) {
        return color = "<div id='uvi-color' style='background-color: red'></div>"
    }
    if (uviColor > 11) {
        return color = "<div id='uvi-color' style='background-color: purple'></div>"
    }
}

//function for grabbing locally stored current day information and displaying that info in card on browswer
function currentDay() {
    if (localStorage.getItem("cityName") === null) {
        const currentDayWeatherInfo = `
            <div id="current-day-weather-info>
                <h1>Please search for a city</h1>
            </div>
        `
        const currentDay = $("#current-day-weather")
        currentDay.append(currentDayWeatherInfo)
    } else {

        // storing currenty day forecast in object to be pulled onto front end
        currentDayForecast = {
            cityName: localStorage.getItem("cityName"),
            date: localStorage.getItem("currentDate"),
            latitude: localStorage.getItem("latitude").trim(),
            longitude: localStorage.getItem("longitude").trim(),
            temp: localStorage.getItem("currentTemp").trim(),
            windSpeed: localStorage.getItem("currentWindSpeed").trim(),
            humidity: localStorage.getItem("currentHumidity").trim(),
            uvi: localStorage.getItem("currentUvi").trim(),
            conditions: localStorage.getItem("currentConditions").trim(),
            conditionImg: localStorage.getItem("currentConditionsImg").trim(),
        }

        // our current day weather card put into template literal to be appended to our index.html
        const currentDayWeatherInfo = `
        
    <div id="current-day-weather-info">
            <h1 class='city-name'>Today in ${currentDayForecast.cityName}</h1>
            <div class="weather-info-wrapper">
                <h4>Current Temperature</h4>
                <h4>Conditions</h4>
                <h4>Wind Speed</h4>
                <h4>UV Index</h4>
                <h4>Humidity</h4>
                <div>${Math.round((currentDayForecast.temp - 273.15) * (9 / 5) + 32)}\u00B0F</div>
                <div>${currentDayForecast.conditions}<img src='https://openweathermap.org/img/wn/${currentDayForecast.conditionImg}@2x.png' alt='Weather Condition Image'></div>
                <div>${currentDayForecast.windSpeed} mph</div>
                <div>${currentDayForecast.uvi}${uviColorDisplay(currentDayForecast.uvi)}</div>
                <div>${currentDayForecast.humidity}%</div>
            </div>
            <button id="save-current-city">Save City</button>
    </div>
    `
        const currentDay = $("#current-day-weather")
        currentDay.append(currentDayWeatherInfo)

        //save current city into local storage
        $("#save-current-city").on("click", function () {
            localStorage.setItem("savedCity", JSON.stringify(currentDayForecast))
            location.reload()
        })
    }
}

// function converting date to a readable format
const realDate = (x) => {
    let unixTimeStamp = x.trim();
    let dateObject = new Date(unixTimeStamp * 1000);
    let readableDate = {
        day: dateObject.toLocaleString('en-US', { weekday: 'long' }),
        month: dateObject.toLocaleString('en-US', { month: 'long' }),
        dayNum: dateObject.toLocaleString('en-US', { day: 'numeric' })
    }
    let date = `${readableDate.day} ${readableDate.month} ${readableDate.dayNum}`
    return date;
}

// five day forecast card creating loop
const fiveDayForecast = () => {
    if (localStorage.getItem("dailyDate") === null) {
        const dailyForecastCard = `
        <div id="current-day-weather-info>
            <h1>Please search for a city</h1>
        </div>
    `
        // grab id from index.html and append dailyForecastCard
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");
        dailyForecastCardWrapper.append(dailyForecastCard)
    } else {
        let dateStr = localStorage.getItem("dailyDate").split(",");
        let tempMaxStr = localStorage.getItem("dailyTempMax").split(",");
        let tempMinStr = localStorage.getItem("dailyTempMin").split(",");
        let windSpeedStr = localStorage.getItem("dailyWindSpeed").split(",");
        let humidityStr = localStorage.getItem("dailyHumidity").split(",");
        let uviStr = localStorage.getItem("dailyUvi").split(",");
        let weatherConditionMainStr = localStorage.getItem("dailyConditionMain").split(",");
        let weatherConditionIconStr = localStorage.getItem("dailyConditionImg").split(",");

        // grab our id form index.html and append daily forecast titles
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");
        let dailyForecasttitle = `
            <h4>Date</h4>
            <h4>Max Temp</h4>
            <h4>Min Temp</h4>
            <h4>Conditions</h4>
            <h4>Wind Speed</h4>
            <h4>UV Index</h4>
            <h4>Humidity</h4>
        `;
        dailyForecastCardWrapper.append(dailyForecasttitle)



        for (let i = 0; i < 5; i++) {
            // five day forecast card using template literals
            const dailyForecastCard = `
                <div>${realDate(dateStr[i])}</div>
                <div>${Math.round(((tempMaxStr[i].trim()) - 273.15) * (9 / 5) + 32)}\u00B0F</div>
                <div>${Math.round(((tempMinStr[i].trim()) - 273.15) * (9 / 5) + 32)}\u00B0F</div>
                <div>${weatherConditionMainStr[i].trim()}<img src='https://openweathermap.org/img/wn/${weatherConditionIconStr[i].trim()}@2x.png' alt='Weather Condition Image'></div>
                <div>${windSpeedStr[i].trim()} mph</div>
                <div>${uviStr[i].trim()}${uviColorDisplay(uviStr[i].trim())}</div>
                <div>${humidityStr[i].trim()}%</div>
        `
            dailyForecastCardWrapper.append(dailyForecastCard)
        }
        const title = `<div id="forecast-title">Five Day Forecast for ${cityNameGlobal}</div>`;
        let fiveDayTitle = $("#five-day-title");
        fiveDayTitle.append(title);
    }
}

function showStoredCity() {

    if (localStorage.getItem("savedCity") === null) {
        const savedCityCard = `
        <div id="no-saved-city">
            <h1>You have no saved cities!</h1>
            <p> Enter a city in the search bar to begin. <p>
        </div>
        `
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

    } else {
        let storedCity = JSON.parse(localStorage.getItem("savedCity"))
        // saved city card for front
        const savedCityCard = `
        <div class="saved-city-weather-info">
            <h1 class='city-name'>Your Saved City: ${storedCity.cityName}</h1>
                <div class="saved-city-wrapper">
                        <h4>Current Temp</h4>
                        <h4>Conditions</h4>
                        <div>${Math.round((storedCity.temp - 273.15) * (9 / 5) + 32)}\u00B0F</div>
                        <div>${storedCity.conditions}<img src='https://openweathermap.org/img/wn/${storedCity.conditionImg}@2x.png' alt='Weather Condition Image'></div>
                </div>
            <button id='show-forecast'>Show Forecast</button>
        </div>
    `
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

        //pull and store lat and lon to potentially display the current city and five day forecasts on click of stored city
        let latitude = localStorage.getItem("latitude")
        let longitude = localStorage.getItem("longitude")

        //new query based off of stored city latitutde and longitude
        let query2 = forecastUrl + "lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely" + apiKey;

        //on click event to reload our stored data from the saved button and display it on the page
        $("#show-forecast").on("click", function () {
            fetch(query2)
                .then(function (response) {
                    return response.json();
                })
                .then(function (res) {

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

                    //on click this will change local storage, reload the page, and displayed the stored citys forecast
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
}

// display functions
currentDay()
fiveDayForecast();
showStoredCity()