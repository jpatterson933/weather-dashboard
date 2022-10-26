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

function fetchData() {

    // searched city from user
    let cityName = $("#city-name").val().trim();

    //this is our inital url that we are using fetch with to gather the lon and lat of cities
    let query = baseUrl + cityName + apiKey;

    //first fetch that pulls lat and lon locations of cities
    fetch(query)
        .then(res => {
            if (res.status === 404) {
                alert("Please enter a valid city name!")
            };
            return res.json();
        })
        .then(data => {

            // console.log(data.city);
            // create our current object


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

            console.log(cityMeridian);

            //make the next url include the lat and lon to create the forecast url -- we also exclude hourly and minutely data so we only get daily
            let query2 = foreCastUrl + "lat=" + cityMeridian.lat + "&lon=" + cityMeridian.long + "&exclude=hourly,minutely" + apiKey;

            //our second fetch grabbing the data from our new url created at query2
            fetch(query2)
                .then(response => { return response.json() })
                .then(res => {

                    console.log(res.daily, "this is my response")
                    console.log(res.daily.length)

                    let cityInfo = JSON.parse(localStorage.getItem("cityMeridian"))
                    // store local data 


                    const foreCastNow = new Object();
                    foreCastNow.city = cityInfo.name;
                    foreCastNow.date = res.current.dt;
                    foreCastNow.temp = res.current.temp;
                    foreCastNow.wndSpd = res.current.wind_speed;
                    foreCastNow.hmid = res.current.humidity;
                    foreCastNow.uvi = res.current.uvi;
                    foreCastNow.desc = res.current.weather[0].main;
                    foreCastNow.icon = res.current.weather[0].icon;


                    //--------------locally store our current day weather condition--------------//
                    storeLocalData("foreCastCard", JSON.stringify(foreCastNow))



                    //----------------------------locally store a five day weather forecast using loop----------------------//
                    // set to loop 6 times
                    const dailyObj = new Object();
                    dailyObj.date = new Array();
                    dailyObj.maxTemp = new Array();
                    dailyObj.minTemp = new Array();
                    dailyObj.wndSpd = new Array();
                    dailyObj.hmid = new Array();
                    dailyObj.uvi = new Array();
                    dailyObj.conditions = new Array();
                    dailyObj.conditionImg = new Array();

                    console.log(dailyObj, "this is my empty object")

                    for (let i = 1; i < 6; i++) {
                        let daily = res.daily[i];
                        let condition = res.daily[i].weather[0];

                        dailyObj.date.push(daily.dt);
                        dailyObj.maxTemp.push(daily.temp.max);
                        dailyObj.minTemp.push(daily.temp.min);
                        dailyObj.wndSpd.push(daily.wind_speed);
                        dailyObj.hmid.push(daily.humidity);
                        dailyObj.uvi.push(daily.uvi);
                        dailyObj.conditions.push(condition.main);
                        dailyObj.conditionImg.push(condition.icon);

                        
                    }
                    storeLocalData("dailyCard", JSON.stringify(dailyObj));
                    //reload page on click to display newly stored information
                    // location.reload()
                })
        })

}


//when the user clicks this button, it will search for a city and store all relevant data for that city and the future five days in local storage
$("#button-search").on("click", function (event) {
    event.preventDefault();
    fetchData();
});


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
        // console.log(foreCastNow, "forecastnow")
        let foreCastCard = JSON.parse(localStorage.getItem('foreCastCard'));
        console.log(foreCastCard, 'the forecase card in the current day function to display saved / stored city shit')



        // {"city":"Los Angeles","date":1666766170,"temp":298.01,"wndSpd":4.27,"hmid":74,"uvi":2,"desc":"Clear","icon":"01d"}

        // our current day weather card put into template literal to be appended to our index.html
        const currentDayWeatherInfo = `
    <div id="current-day-weather-info">
            <h1 class="city-name">Currently in ${foreCastCard.city}</h1>
            <div class="weather-info-wrapper">
                <h4>Conditions</h4>
                <h4>Wind</h4>
                <h4>UV</h4>
                <h4>Humidity</h4>
                <div>${calculateFahrenheit((foreCastCard.temp), (foreCastCard.desc))}</div>
                <div>${foreCastCard.wndSpd}mph</div>
                <div>
                    <div>${foreCastCard.uvi}</div>
                    <div>${uviColorDisplay(foreCastCard.uvi)}</div>
                </div>
                <div>${foreCastCard.hmid}%</div>
            </div>
            <button id="save-current-city">Save City</button>
    </div>
    `
        const currentDay = $("#current-day-weather")
        currentDay.append(currentDayWeatherInfo)

        //save current city into local storage
        $("#save-current-city").on("click", function () {
            // localStorage.setItem("savedCity", JSON.stringify(currentDayForecast))
            localStorage.setItem("foreCastCard", JSON.stringify(foreCastCard));

            // location.reload()
        })
    }
}


// five day forecast card creating loop
const fiveDayForecast = () => {

    let dailyCard = JSON.parse(localStorage.getItem("dailyCard"));
    console.log(dailyCard, "tsting again");
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
        let foreCastCard = JSON.parse(localStorage.getItem('foreCastCard'));
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
                <div>${dailyObjCard.conditions[i]}</div>
                <div>${dailyObjCard.wndSpd[i]} mph</div>
                <div>
                    <div>${dailyObjCard.uvi[i]}</div>
                    <div>${uviColorDisplay(dailyObjCard.uvi[i])}</div>
                </div>
                <div>${dailyObjCard.hmid[i]}%</div>
        `
            dailyForecastCardWrapper.append(dailyForecastCard)
        }
        const title = `<div id="forecast-title">Five Day Forecast for ${foreCastCard.city}</div>`;
        let fiveDayTitle = $("#five-day-title");
        fiveDayTitle.append(title);
    }
}

function showStoredCity() {
    let foreCastCard = JSON.parse(localStorage.getItem('foreCastCard'));
    console.log(foreCastCard)

    if (foreCastCard === null) {
        const savedCityCard = `
        <div id="no-saved-city">
            <h3>You have no saved cities!</h3>
            <p> Enter a city in the search bar to begin. <p>
        </div>
        `
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

    } else {
        let cityLogistics = JSON.parse(localStorage.getItem("cityMeridian"));
        let storedCity = JSON.parse(localStorage.getItem("foreCastCard"))

        console.log(storedCity, "city logic")

        // saved city card
        const savedCityCard = `
        <div class="saved-city">
        <h1>${storedCity.city}</h1>
        <p>${calculateFahrenheit(storedCity.temp)}</p>
        <p>${storedCity.desc}</p>
        <button id="show-forecast">Show Forecast</button>
        </div>
        `   // end saved city card
        const savedCityWeather = $("#saved-city-weather")
        savedCityWeather.append(savedCityCard)

        //new query based off of stored city latitutde and longitude
        let query2 = foreCastUrl + "lat=" + cityLogistics.lat + "&lon=" + cityLogistics.long + "&exclude=hourly,minutely" + apiKey;

        //on click event to reload our stored data from the saved button and display it on the page
        $("#show-forecast").on("click", function () {
            fetch(query2)
                .then(function (response) {
                    return response.json();
                })
                .then(res => {


                    const foreCastNow = new Object();
                    foreCastNow.city = cityLogistics.name;
                    foreCastNow.date = res.current.dt;
                    foreCastNow.temp = res.current.temp;
                    foreCastNow.wndSpd = res.current.wind_speed;
                    foreCastNow.hmid = res.current.humidity;
                    foreCastNow.uvi = res.current.uvi;
                    foreCastNow.desc = res.current.weather[0].main;
                    foreCastNow.icon = res.current.weather[0].icon;

                    console.log(foreCastNow, 'forecast')

                    let todayCard = JSON.parse(localStorage.getItem("foreCastCard"));
                    console.log(todayCard, 'testing test')
                    storeLocalData("foreCastCard", JSON.stringify(todayCard))


                    // location.reload()
                })
        })
    }
}

// display functions
currentDay()
fiveDayForecast();
showStoredCity()