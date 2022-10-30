let searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
let baseUrl = "https://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
let foreCastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
// import { apiKey } from './config.js';
// free api, not hidden, anyone can use
const apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195";

// store in local storage function
function storeLocalData(title, item) {
    localStorage.setItem(title, item);
};

// function to fetch our forecast data based off of the latitude and longitude of our city meridian data
function fetchForecast(lat, lon, info) {
    //url to fetch daily forecast data -- we exclude hourly and minutely data
    let query = foreCastUrl + "lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely" + apiKey;

    fetch(query)
        .then(response => { return response.json() })
        .then(res => {
            console.log(res.current.timezone, "reso");
            console.log(res)

            // grab our city Meridian data
            let cityInfo = JSON.parse(localStorage.getItem(info));
            console.log(cityInfo, "city info again")

            // create current forecast object
            const current = new Object();
            current.city = cityInfo.city;
            current.lat = cityInfo.lat;
            current.lon = cityInfo.lon;
            current.date = res.current.dt;
            current.temp = res.current.temp;
            current.feels = res.current.feels_like;
            current.sunrise = res.current.sunrise;
            current.sunset = res.current.sunset;
            current.wndSpd = (res.current.wind_speed).toFixed(1);
            current.wndSpdKph = ((res.current.wind_speed) * 1.60934).toFixed(1)
            current.wndDir = res.current.wind_speed;
            current.hmid = res.current.humidity;
            current.dew = res.current.dew_point;
            current.uvi = res.current.uvi;
            current.main = res.current.weather[0].main;
            current.desc = res.current.weather[0].description;
            current.icon = res.current.weather[0].icon;
            current.timeZone = res.timezone;

            // create daily ForeCast object with empty arrays for data
            const dailyFC = new Object();
            dailyFC.city = cityInfo.city;
            dailyFC.lat = cityInfo.lat;
            dailyFC.lon = cityInfo.lon;
            dailyFC.date = new Array();
            dailyFC.dayTemp = new Array();
            dailyFC.eveTemp = new Array();
            dailyFC.maxTemp = new Array();
            dailyFC.minTemp = new Array();
            dailyFC.feelsDay = new Array();
            dailyFC.feelsEve = new Array();
            dailyFC.sunrise = new Array();
            dailyFC.sunset = new Array();
            dailyFC.wndSpd = new Array();
            dailyFC.wndSpdKph = new Array();
            dailyFC.wndDir = new Array();
            dailyFC.wndGust = new Array();
            dailyFC.hmid = new Array();
            dailyFC.dew = new Array();
            dailyFC.uvi = new Array();
            dailyFC.main = new Array();
            dailyFC.desc = new Array();
            dailyFC.icon = new Array();
            dailyFC.timeZone = res.timezone;

            //----------------------------locally store a forecast using forEach() ----------------------//
            res.daily.forEach(element => {
                dailyFC.date.push(element.dt);
                dailyFC.dayTemp.push(element.temp.day);
                dailyFC.eveTemp.push(element.temp.eve);
                dailyFC.maxTemp.push(element.temp.max);
                dailyFC.minTemp.push(element.temp.min);
                dailyFC.feelsDay.push(element.feels_like.day);
                dailyFC.feelsEve.push(element.feels_like.eve);
                dailyFC.sunrise.push(element.sunrise);
                dailyFC.sunset.push(element.sunset);
                dailyFC.wndSpd.push((element.wind_speed).toFixed(1));
                dailyFC.wndSpdKph.push(((element.wind_speed) * 1.60934).toFixed(1));
                dailyFC.wndDir.push(element.wind_deg);
                dailyFC.wndGust.push((element.wind_gust).toFixed(1));
                dailyFC.hmid.push(element.humidity);
                dailyFC.dew.push(element.dew_point)
                dailyFC.uvi.push(element.uvi);
                dailyFC.main.push(element.weather[0].main);
                dailyFC.desc.push(element.weather[0].description);
                dailyFC.icon.push(element.weather[0].icon);
            });

            //--------------locally store our current weather and our 8 day forecast --------------//
            storeLocalData("current", JSON.stringify(current));
            storeLocalData("daily", JSON.stringify(dailyFC));

            //reload page on click to display newly stored information
            // location.reload();
        });
};


function fetchCity() {

    // searched city from user
    let cityName = $("#city-name").val().trim();

    //this is our inital url that we are using fetch with to gather the lon and lat of cities
    let query = baseUrl + cityName + apiKey;

    //first fetch that pulls lat and lon locations of cities
    fetch(query)
        .then(res => { if (res.status === 404) { alert("Please enter a valid city name!") } return res.json() })
        .then(data => {

            const cityMeridian = new Object();
            cityMeridian.city = data.city.name;
            cityMeridian.lat = data.city.coord.lat;
            cityMeridian.lon = data.city.coord.lon;

            storeLocalData("cityMeridian", JSON.stringify(cityMeridian));
            fetchForecast((cityMeridian.lat), (cityMeridian.lon), "cityMeridian");
        })
}

//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
$("#button-search").on("click", function (event) {
    event.preventDefault();
    fetchCity();
});

//function for grabbing locally stored current day information and displaying that info in card on browswer
function currentDay() {

    if (JSON.parse(localStorage.getItem("current")) === null) {
        const currentDayWeatherInfo = `
        <div id="current-day-weather-info>
            <h1>Please search for a city</h1>
        </div>
        `
        const currentDay = $("#current-day-weather");
        currentDay.append(currentDayWeatherInfo);
    } else {
        // console.log(foreCastNow, "forecastnow")
        let current = JSON.parse(localStorage.getItem("current"));

        // our current day weather card put into template literal to be appended to our index.html
        const currentDayWeatherInfo = `
        <section id="current-card">
            <h1>${current.city}</h1>
            <details>
                <summary>${getTimeZone(current.timeZone)}</summary>
                <p>${current.city} is in the ${current.timeZone} timezone</p>
            </details>
            <details>
                <summary>Forecast: ${calculateFahrenheit((current.temp), (current.main))}</summary>
                <p>It feels like ${calculateFahrenheit((current.feels))} and the local weather description is "${current.desc}"</p>
            </details>            
            <details>
                <summary>What about the wind!?</summary>
                <div>
                    <p>The wind is blowing ${getCardinalDirection(current.wndDir)} at ${current.wndSpd} mph (miles per hour)</p>
                    <p>OR ${current.wndSpdKph} kph (kilometers per hour)</p>
                </div>
            </details>
            <details>
                <summary>Worried about your skin and UV radiation?</summary>
                <div>
                    <p>UV Index Rating: ${current.uvi}</p>
                    ${uviColorDisplay(current.uvi)}
                </div>
            </details>
            <details>
                <summary>Stuff about water..</summary>
                <div>
                    <p>Humidity: ${current.hmid}%</p>
                    <p>Water will form in the air at ${calculateFahrenheit(current.dew)}</p>
                    <p>This means that your windows will have condensation!</p>
                    <p>Is it going to rain? idk check your local forecast!!</p>
                </div>
            </details>
            <details>
                <summary>Appearance and dissappearance of the sun.</summary>
                <div>
                    <p>Wake up and enjoy the Sunrise at ${convertSecondsToTime(current.sunrise)}</p>
                    <p>Unless of course you love sleeping in!</p>
                    <p>Sunset: ${convertSecondsToTime(current.sunset)}</p>
                    <p>Best time of day, literally just step outside and stare at the sun!</p>
                </div>
            </details>       
            <button id="save-current-city">Save City</button>
        </section>
    `
        const currentDay = $("#current-day-weather");
        currentDay.append(currentDayWeatherInfo);

        //save current city into local storage
        $("#save-current-city").on("click", function () {
            // store current city in local storage as savedCity for later use
            localStorage.setItem("savedCity", JSON.stringify(current));

            // location.reload();
        });
    };
};


// five day forecast card creating loop
const fiveDayForecast = () => {

    let daily = JSON.parse(localStorage.getItem("daily"));

    if (daily === null) {
        const dailyForecastCard = `
        <div id="current-day-weather-info>
            <h1>Please search for a city</h1>
        </div>
    `
        // grab id from index.html and append dailyForecastCard
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");
        dailyForecastCardWrapper.append(dailyForecastCard);
    } else {
        // grab our id form index.html and append daily forecast titles
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");


        for (let i = 0; i < 5; i++) {
            // five day forecast card using template literals
            const dailyForecastCard = `
            <section id="daily-card">
            <summary>${realDate(daily.date[i])}</summary>
            <div>${calculateFahrenheit((daily.dayTemp[i]), (daily.main[i]))}</div>
                <details>
                    <summary>Unnecessary Details</summary>
                    <details>
                    <summary>Tempeature Details</summary
                        <div>
                            <p>Max Temp ${calculateFahrenheit(daily.maxTemp[i])}</p>
                            <p>During the day it will feel like ${calculateFahrenheit(daily.feelsDay[i])}</p>
                            <p>At night it will be ${calculateFahrenheit(daily.eveTemp[i])}</p>
                            <p>Lowest Temp ${calculateFahrenheit(daily.minTemp[i])}</p>
                            <p>At night it will feel like ${calculateFahrenheit(daily.feelsEve[i])}</p>
                        </div>
                    </details>
                        
                <details>
                    <summary>Wind Details</summary>
                    <div>
                        <p>The wind is blowing ${getCardinalDirection(daily.wndDir[i])} at ${daily.wndSpd[i]} mph (miles per hour)</p>
                        <p>OR ${daily.wndSpdKph[i]} kph (kilometers per hour)</p>
                        <p>Wind gust of up to ${daily.wndGust[i]} mph</p>
                    </div>
                </details>
                <details>
                    <summary>Ultra Violet Details</summary>
                    <div>
                        <p>UV Index Rating: ${daily.uvi[i]}</p>
                        ${uviColorDisplay(daily.uvi[i])}
                    </div>
                </details>
                <details>
                    <summary>Hydro Details</summary>
                    <div>
                        <p>Humidity: ${daily.hmid[i]}%</p>
                        <p>Water will form in the air at ${calculateFahrenheit(daily.dew[i])}</p>
                        <p>This means that your windows will have condensation!</p>
                        <p>Is it going to rain? idk check your local forecast!!</p>
                    </div>
                </details>
                <details>
                    <summary>Sun Details</summary>
                    <div>
                        <p>Wake up and enjoy the Sunrise at ${convertSecondsToTime(daily.sunrise[i])}</p>
                        <p>Unless of course you love sleeping in!</p>
                        <p>Sunset: ${convertSecondsToTime(daily.sunset[i])}</p>
                        <p>Best time of day, literally just step outside and stare at the sun!</p>
                    </div>
                </details>      
                </details> 
            </section>
        `
            dailyForecastCardWrapper.append(dailyForecastCard);
        }
        let fiveDayTitle = $("#five-day-title");
    }
}

function showStoredCity() {
    let savedCity = JSON.parse(localStorage.getItem("savedCity"));

    if (savedCity === null) {
        const savedCityCard = `
        <div id="no-saved-city">
            <h3>You have no saved cities!</h3>
            <p> Enter a city in the search bar to begin. <p>
        </div>
        `
        const savedCityWeather = $("#saved-city-weather");
        savedCityWeather.append(savedCityCard);

    } else {

        // saved city card
        const savedCityCard = `
        <h1>${savedCity.city}</h1>
        <button id="show-forecast">Show Forecast</button>
        `   // end saved city card
        const savedCityWeather = $("#saved-city-weather");
        savedCityWeather.append(savedCityCard);

        //on click event to reload our stored data from the saved button and display it on the page
        $("#show-forecast").on("click", function () {
            // fetch most recent updated forecast on show forecast button click
            fetchForecast((savedCity.lat), (savedCity.lon), "savedCity");
        });
    };
};

// function for color coded uv index
function uviColorDisplay(uviColor) {

    let uvi = parseInt(uviColor);

    if (uvi < 3) {
        return "<p>UV Index color: <div id='uvi-color' style='background-color: green'></div></p>";
    }
    if (uvi > 2 && uvi < 6) {
        return "<p>UV Index color: <div id='uvi-color' style='background-color: yellow'></div></p>";
    }
    if (uvi > 5 && uvi < 8) {
        return "<p>UV Index color: <div id='uvi-color' style='background-color: orange'></div></p>";
    }
    if (uvi > 7 && uvi < 11) {
        return "<p>UV Index color: <div id='uvi-color' style='background-color: red'></div></p>";
    }
    if (uvi > 11) {
        return "<p>UV Index color: <div id='uvi-color' style='background-color: purple'></div></p>";
    }
};

// function to calculate fahrenheit, def enter temp and maybe conditions
function calculateFahrenheit(temp, ...conditions) {
    return `${Math.round((temp - 273.15) * (9 / 5) + 32)}\u00B0F ${conditions}`;
};

// function converting date to a readable format
const realDate = (unixTimeStamp) => {

    let dateObject = new Date(unixTimeStamp * 1000);

    let readableDate = {
        day: dateObject.toLocaleString('en-US', { weekday: 'long' }),
        dayNum: dateObject.toLocaleString('en-US', { day: 'numeric' })
    };
    let date = `${readableDate.day} ${readableDate.dayNum} `;
    return date;
};

// function to get current time
const getCurrentTime = () => {
    const dateTimeStr = new Date().toLocaleString()
    const result = (dateTimeStr.split(", ")[0], dateTimeStr.split(", ")[1])
    return result;
}
// function to return time from specific time zone
function getTimeZone(tz) {
    let date = new Date();
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' }).format(date);
}
// function to convert seconds to a normal 10:00am time
const convertSecondsToTime = (seconds) => {

    const dateTimeStr = new Date(seconds * 1000).toLocaleString()
    const result = (dateTimeStr.split(", ")[0], dateTimeStr.split(", ")[1])
    return result;
};
// function to grab cardinal direction based off of degrees
const getCardinalDirection = (angle) => {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    return directions[Math.round(angle / 22.5) % 8];
}

// display functions
currentDay();
fiveDayForecast();
showStoredCity();

// // canvas script for clouds might use this might not - this does not live with the mvp
// var canvas = document.querySelector('canvas');
// var ctx = canvas.getContext('2d');

// const drawCloud = (x, y) => {
//     ctx.beginPath();
//     ctx.arc(x, y, 60, Math.PI * 0.5, Math.PI * 1.5);
//     ctx.arc(x + 70, y - 60, 70, Math.PI * 1, Math.PI * 1.85);
//     ctx.arc(x + 152, y - 45, 50, Math.PI * 1.37, Math.PI * 1.91);
//     ctx.arc(x + 200, y, 60, Math.PI * 1.5, Math.PI * 0.5);
//     ctx.moveTo(x + 200, y + 60);
//     ctx.lineTo(x, y + 60);
//     ctx.strokeStyle = '#797874';
//     ctx.stroke();
//     ctx.fillStyle = '#8ED6FF';
//     ctx.fill()
// };
