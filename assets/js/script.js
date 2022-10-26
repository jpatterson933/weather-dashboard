let searchButton = $("#button-search");
//this base url pulls my latitude and logitude positions from whatever city is inputed
let baseUrl = "https://api.openweathermap.org/data/2.5/forecast?&q="
//this input pulls my daily forcast
let foreCastUrl = "https://api.openweathermap.org/data/2.5/onecall?";
//this is my api key
let apiKey = "&appid=3eba9a255d0b187b6983dc669df8b195"

// store in local storage function
function storeLocalData(title, item) {
    localStorage.setItem(title, item);
};

// function to fetch our forecast data based off of the latitude and longitude of our city meridian data
function fetchForecast(lat, lon) {
    //url to fetch daily forecast data -- we exclude hourly and minutely data
    let query = foreCastUrl + "lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely" + apiKey;

    fetch(query)
        .then(response => { return response.json() })
        .then(res => {

            // grab our city Meridian data
            let cityInfo = JSON.parse(localStorage.getItem("cityMeridian"))

            // create current forecast object
            const current = new Object();
            current.city = cityInfo.name;
            current.date = res.current.dt;
            current.temp = res.current.temp;
            current.feels = res.current.feels_like;
            current.sunset = res.current.sunset;
            current.wndSpd = res.current.wind_speed;
            current.hmid = res.current.humidity;
            current.dew = res.current.dew_point;
            current.uvi = res.current.uvi;
            current.main = res.current.weather[0].main;
            current.desc = res.current.weather[0].description;
            current.icon = res.current.weather[0].icon;

            // create daily ForeCast object with empty arrays for data
            const dailyFC = new Object();
            dailyFC.city = cityInfo.name;
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
            dailyFC.hmid = new Array();
            dailyFC.dew = new Array();
            dailyFC.uvi = new Array();
            dailyFC.main = new Array();
            dailyFC.desc = new Array();
            dailyFC.icon = new Array();

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
                dailyFC.wndSpd.push(element.wind_speed);
                dailyFC.hmid.push(element.humidity);
                dailyFC.dew.push(element.dew_point)
                dailyFC.uvi.push(element.uvi);
                dailyFC.main.push(element.weather[0].main);
                dailyFC.desc.push(element.weather[0].description);
                dailyFC.icon.push(element.weather[0].icon);
            });

            //--------------locally store our current weather and our 8 day forecast --------------//
            storeLocalData("current", JSON.stringify(current));
            storeLocalData("dailyCard", JSON.stringify(dailyFC));

            //reload page on click to display newly stored information
            // location.reload()
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
            cityMeridian.name = data.city.name;
            cityMeridian.lat = data.city.coord.lat;
            cityMeridian.long = data.city.coord.lat;

            storeLocalData("cityMeridian", JSON.stringify(cityMeridian));

            //store city name, latitude and longtitude respectively
            storeLocalData("country", data.city.country)
            storeLocalData("cityName", data.city.name)
            storeLocalData("latitude", data.city.coord.lat)
            storeLocalData("longitude", data.city.coord.lon);

            fetchForecast((cityMeridian.lat), (cityMeridian.long))
        })

}


//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
$("#button-search").on("click", function (event) {
    event.preventDefault();
    fetchCity();
});



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
        // console.log(foreCastNow, "forecastnow")
        let current = JSON.parse(localStorage.getItem('current'));
        console.log(current, 'the forecase card in the current day function to display saved / stored city shit')



        // {"city":"Los Angeles","date":1666766170,"temp":298.01,"wndSpd":4.27,"hmid":74,"uvi":2,"desc":"Clear","icon":"01d"}

        // our current day weather card put into template literal to be appended to our index.html
        const currentDayWeatherInfo = `
    <div id="current-day-weather-info">
            <h1 class="city-name">Currently in ${current.city}</h1>
            <div class="weather-info-wrapper">
                <h4>Conditions</h4>
                <h4>Wind</h4>
                <h4>UV</h4>
                <h4>Humidity</h4>
                <div>${calculateFahrenheit((current.temp), (current.desc))}</div>
                <div>${current.wndSpd}mph</div>
                <div>
                    <div>${current.uvi}</div>
                    <div>${uviColorDisplay(current.uvi)}</div>
                </div>
                <div>${current.hmid}%</div>
            </div>
            <button id="save-current-city">Save City</button>
    </div>
    `
        const currentDay = $("#current-day-weather")
        currentDay.append(currentDayWeatherInfo)

        //save current city into local storage
        $("#save-current-city").on("click", function () {
            // localStorage.setItem("savedCity", JSON.stringify(currentDayForecast))
            // it should be just the lat and long saved here and then displayed on the screen when the page loads
            localStorage.setItem("savedCity", JSON.stringify(current));

            location.reload()
        })
    }
}


// five day forecast card creating loop
const fiveDayForecast = () => {

    let dailyCard = JSON.parse(localStorage.getItem("dailyCard"));

    if (dailyCard === null) {
        const dailyForecastCard = `
        <div id="current-day-weather-info>
            <h1>Please search for a city</h1>
        </div>
    `
        // grab id from index.html and append dailyForecastCard
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");
        dailyForecastCardWrapper.append(dailyForecastCard)
    } else {
        // city info
        let current = JSON.parse(localStorage.getItem('current'));
        let dailyObjCard = JSON.parse(localStorage.getItem("dailyCard"));

        console.log(dailyObjCard, "object card retrieved from local storage")


        // grab our id form index.html and append daily forecast titles
        let dailyForecastCardWrapper = $("#daily-forecast-card-wrapper");
        let dailyForecasttitle = `
            <h4>Date</h4>
            <h4>Max - Min</h4>
            <h4>Conditions</h4>
            <h4>Wind</h4>
            <h4>UV</h4>
            <h4>Humidity</h4>
        `;
        dailyForecastCardWrapper.append(dailyForecasttitle)

        console.log(dailyObjCard.date, 'date')

        for (let i = 0; i < 5; i++) {
            // five day forecast card using template literals
            const dailyForecastCard = `
                <div>${realDate(dailyObjCard.date[i])}</div>
                <div>${calculateFahrenheit(dailyObjCard.maxTemp[i])} - ${calculateFahrenheit(dailyObjCard.minTemp[i])}</div>
                <div>${dailyObjCard.main[i]}</div>
                <div>${dailyObjCard.wndSpd[i]} mph</div>
                <div>
                    <div>${dailyObjCard.uvi[i]}</div>
                    <div>${uviColorDisplay(dailyObjCard.uvi[i])}</div>
                </div>
                <div>${dailyObjCard.hmid[i]}%</div>
        `
            dailyForecastCardWrapper.append(dailyForecastCard)
        }
        const title = `<div id="forecast-title">Five Day Forecast for ${current.city}</div>`;
        let fiveDayTitle = $("#five-day-title");
        fiveDayTitle.append(title);
    }
}

function showStoredCity() {
    let savedCity = JSON.parse(localStorage.getItem('savedCity'));
    console.log(savedCity, "will be null if there is no saved city")

    if (savedCity === null) {
        const savedCityCard = `
        <div id="no-saved-city">
            <h3>You have no saved cities!</h3>
            <p> Enter a city in the search bar to begin. <p>
        </div>
        `
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

    } else {
        let cityMeridian = JSON.parse(localStorage.getItem("cityMeridian"));
        let savedCity = JSON.parse(localStorage.getItem("savedCity"))

        console.log(savedCity, "city logic")

        // saved city card
        const savedCityCard = `
        <div class="saved-city">
        <h1>${savedCity.city}</h1>
        <button id="show-forecast">Show Forecast</button>
        </div>
        `   // end saved city card
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

        //on click event to reload our stored data from the saved button and display it on the page
        $("#show-forecast").on("click", function () {

            fetchForecast((cityMeridian.lat), (cityMeridian.long))
        })
    }
}


// function for color coded uv index
function uviColorDisplay(uviColor) {
    console.log(typeof uviColor)

    let uvi = parseInt(uviColor);

    if (uvi < 3) {
        return color = "<div id='uvi-color' style='background-color: green'></div>";
    }
    if (uvi > 2 && uvi < 6) {
        return color = "<div id='uvi-color' style='background-color: yellow'></div>"
    }
    if (uvi > 5 && uvi < 8) {
        return color = "<div id='uvi-color' style='background-color: orange'></div>"
    }
    if (uvi > 7 && uvi < 11) {
        return color = "<div id='uvi-color' style='background-color: red'></div>"
    }
    if (uvi > 11) {
        return color = "<div id='uvi-color' style='background-color: purple'></div>"
    }
};

// function to calculate fahrenheit, def enter temp and maybe conditions
function calculateFahrenheit(temp, ...conditions) {
    return `${Math.round((temp - 273.15) * (9 / 5) + 32)}\u00B0F ${conditions}`
};

// function converting date to a readable format
const realDate = (unixTimeStamp) => {

    let dateObject = new Date(unixTimeStamp * 1000);
    let readableDate = {
        day: dateObject.toLocaleString('en-US', { weekday: 'short' }),
        dayNum: dateObject.toLocaleString('en-US', { day: 'numeric' })
    }
    let date = `${readableDate.dayNum} ${readableDate.day}`
    return date;
};


// display functions
currentDay()
fiveDayForecast();
showStoredCity()