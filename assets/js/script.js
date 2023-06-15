let searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
let baseUrl = "https://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
let foreCastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
// import { apiKey } from './config.js';
// free api, not hidden, anyone can use
const apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195";

// After the user jumps onto the page, hide the welcome message
const hideIntro = () => {
    setTimeout(() => {
        let introMessage = $("#intro")
        // console.log(introMessage)
        console.log(introMessage, "testing")
        introMessage[0].style.display = "none";

    }, 3000)
};

hideIntro();

// store in local storage function
function storeLocalData(title, item) {
    localStorage.setItem(title, item);
};
// CLASS FOR DAILY FORECAST

class CurrentFC {
    constructor(city, lat, lon, date, temp, feels, sunrise, sunset, wndSpd, wndSpdKph, wndDir, hmid, dew, uvi, main, desc, icon, timeZone) {
        this.city = city;
        this.lat = lat;
        this.lon = lon;
        this.date = date;
        this.temp = temp;
        this.feels = feels;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.wndSpd = wndSpd.toFixed(1);
        this.wndSpdKph = ((wndSpdKph) * 1.60934).toFixed(1);
        this.wndDir = wndDir;
        this.hmid = hmid;
        this.dew = dew;
        this.uvi = uvi;
        this.main = main;
        this.desc = desc;
        this.icon = icon;
        this.timeZone = timeZone;
    }
}



class DailyFC extends CurrentFC {
    constructor(city, lat, lon, date, dayTemp, eveTemp, maxTemp, minTemp, feelsDay, feelsEve, sunrise, sunset, wndSpd, wndSpdKph, wndDir, wndGust, hmid, dew, uvi, main, desc, icon, timeZone) {
        super(city, lat, lon)
        this.date = date;
        this.dayTemp = dayTemp;
        this.eveTemp = eveTemp;
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.feelsDay = feelsDay;
        this.feelsEve = feelsEve;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.wndSpd = wndSpd;
        this.wndSpdKph = wndSpdKph;
        this.wndDir = wndDir;
        this.wndGust = wndGust;
        this.hmid = hmid;
        this.dew = dew;
        this.uvi = uvi;
        this.main = main;
        this.desc = desc;
        this.icon = icon;
        this.timeZone = timeZone;
    }
}

// function to fetch our forecast data based off of the latitude and longitude of our city meridian data
function fetchForecast(lat, lon, info) {
    //url to fetch daily forecast data -- we exclude hourly and minutely data
    let query = foreCastUrl + "lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely" + apiKey;

    fetch(query)
        .then(response => response.json())
        .then(res => {
            // grab our city Meridian data
            let cityInfo = JSON.parse(localStorage.getItem(info));

            const current = new CurrentFC(cityInfo.city, cityInfo.lat, cityInfo.lon, res.current.dt, res.current.temp,
                res.current.feels_like, res.current.sunrise, res.current.sunset, res.current.wind_speed, res.current.wind_speed, res.current.wind_speed, res.current.humidity, res.current.dew_point, res.current.uvi, res.current.weather[0].main, res.current.weather[0].description, res.current.weather[0].icon, res.timezone)

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
            location.reload();
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
            // store og data for city name, city longitude, and city latitude //
            const cityMeridian = new Object();
            cityMeridian.city = data.city.name;
            cityMeridian.lat = data.city.coord.lat;
            cityMeridian.lon = data.city.coord.lon;

            storeLocalData("cityMeridian", JSON.stringify(cityMeridian));
            fetchForecast((cityMeridian.lat), (cityMeridian.lon), "cityMeridian");
        })
}

//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
$("#button-search").on("click", event => {
    event.preventDefault();
    fetchCity();
});



//function for grabbing locally stored current day information and displaying that info in card on browswer
function currentDay() {

    if (JSON.parse(localStorage.getItem("current")) === null) {
        console.log("local storage is empty")
    } else {
        let current = JSON.parse(localStorage.getItem("current"));

        // our current day weather card put into template literal to be appended to our index.html
        const currentDayWeatherInfo = `
        <section id="current-card">
            <h1>${current.city}</h1>
            <ul>
                <li>${getTimeZone(current.timeZone)}</li>
                <li>${current.city} is in the ${current.timeZone} timezone</li>
                <li>Forecast: ${calculateFahrenheit((current.temp), (current.main))}</li>
                <li>It feels like ${calculateFahrenheit((current.feels))}</li>
                <li>${current.desc}</li>
                <li>The wind is blowing ${getCardinalDirection(current.wndDir)} at ${current.wndSpd} mph (miles per hour)</li>
                <li>OR ${current.wndSpdKph} kph (kilometers per hour)</li>
                <li>UV Index Rating: ${current.uvi}</li>
                <li>${uviColorDisplay(current.uvi)}</li>
                <li>Humidity: ${current.hmid}%</li>
                <li>Water will form in the air at ${calculateFahrenheit(current.dew)}</li>
                <li>Sunrise: ${convertSecondsToTime(current.sunrise)}</li>
                <li>Sunset: ${convertSecondsToTime(current.sunset)}</li>
            </ul>
            <button id="save-current-city">Save City</button>
        </section>
    `
        const currentDay = $("#current-day-weather");
        currentDay.append(currentDayWeatherInfo);

        //save current city into local storage
        $("#save-current-city").on("click", function () {
            // store current city in local storage as savedCity for later use
            localStorage.setItem("savedCity", JSON.stringify(current));

            location.reload();
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
                        <p>Wind gusts of up to ${daily.wndGust[i]} mph</p>
                        <p>A wind gust is a sudden, brief increase in speed of the wind</p>
                        <p>Sound dramatic!!</p>
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
        return "<div id='uvi-color' style='background-color: green'></div>";
    }
    if (uvi > 2 && uvi < 6) {
        return "<div id='uvi-color' style='background-color: yellow'></div>";
    }
    if (uvi > 5 && uvi < 8) {
        return "<div id='uvi-color' style='background-color: orange'></div>";
    }
    if (uvi > 7 && uvi < 11) {
        return "<div id='uvi-color' style='background-color: red'></div>";
    }
    if (uvi > 11) {
        return "<div id='uvi-color' style='background-color: purple'></div>";
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