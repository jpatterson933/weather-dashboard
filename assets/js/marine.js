// const moment = require("moment");

// import json files
// import surfData from "./surfData.json" assert {type: "json"}
// console.log(surfData)

// Test scripts
const test = localStorage.getItem("cityName")
const test2 = localStorage.getItem("longitude")

const API_KEY = marine.key;
const lat = localStorage.getItem("latitude");
const lon = localStorage.getItem("longitude");
const storedCity = localStorage.getItem("cityName");
const storedCountry = localStorage.getItem("country");

const cityNameDisplay = document.getElementById('city');
const cityAndCountry = storedCity + ", " + storedCountry;
cityNameDisplay.append(cityAndCountry);


// function degToCompass(num) {
//     var val = Math.floor((num / 22.5) + 0.5);
//     var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
//     return arr[(val % 16)];


// /* function to map directions to cardinal map */
const getCardinalDirection = (angle) => {
    const directions = ['↑ N', 'NNE', '↗ NE', 'ENE', '→ E', 'ESE', '↘ SE', 'SSE', '↓ S', 'SSW', '↙ SW', 'WSW', '← W', 'WNW', '↖ NW', 'NNW'];
    return directions[Math.round(angle / 22.5) % 16];
}

// surf class - stores all data to be parsed through for surfing condigions
class Surf {
    constructor(seaLevel, swellDirection, swellHeight, swellPeriod, time, waveHeight, wavePeriod, windSpeed, windDirection, currentDirection, currentSpeed) {
        this.seaLevel = seaLevel[0].value;
        this.swellDirection = swellDirection;
        this.swellHeight = swellHeight;
        this.swellPeriod = swellPeriod;
        this.time = time;
        this.waveHeight = waveHeight;
        this.wavePeriod = wavePeriod;
        this.windSpeed = windSpeed;
        this.windDirection = windDirection;
        this.currentDirection = currentDirection;
        this.currentSpeed = currentSpeed;
    }
};


const calculateHours = (addHours, date) => {
    return time = moment(date, "YYYY-MM-DD").add(addHours, 'hours').calendar();
}

/* Important data for Andres - Surfer Insight
    Wave Height, Swell direction, Wind Direction, Tide Height
     -- It is said that these factors are usually predictors of how big waves are */
const hourlySurfData = [];


// handle our loading symbol
// html elemtn
const loading = document.getElementById("loader");
let showLoadSymb = null;

// Our loading symbol function
const dataLoading = (status, element) => {
    if (status === true) {
        element.style.display = "block";
    } else if (status === false) {
        element.style.display = "none";
    }
}

// get current hour in Iso format
const getCurrentHourIso = () => {
    let currentDate = moment().format();
    let currentHourIso = currentDate.split(":")[0];
    // console.log(currentDate)
    return currentHourIso;
}

// main fetch wave forecast function
const fetchWaveForecastData = (latitude, longitude, savedCity) => {


    const url = "https://stormglass.p.rapidapi.com/forecast?lat=";
    const params = 'swellHeight,swellDirection,swellPeriod,waveHeight,wavePeriod,seaLevel,windSpeed,windDirection,currentDirection,currentSpeed';
    let query = `${url}${latitude}&lng=${longitude}&params=${params}`;
    fetch(query, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "stormglass.p.rapidapi.com",
            "x-rapidapi-key": API_KEY
        }
    })
        .then(response => {
            // this is our loading symbol
            showLoadSymb = true;
            dataLoading(showLoadSymb, loading)
            // return results in json format
            return response.json();
        })
        .then((data) => {
            // loading symbol goes away once data loads
            showLoadSymb = false;
            dataLoading(showLoadSymb, loading)
            // set current hour in iso format to dateAndHourNow 
            let dateAndHourNow = getCurrentHourIso();
            // set an empty variable for grabbing split time
            let timeIndexSplit;
            // for each loop through our data
            data.hours.forEach((time, index) => {

                if (dateAndHourNow === time.time.split(":")[0]) {
                    // console.log(time.time, index, "we have caputure our time")
                    timeIndexSplit = index;
                };
            });

            let wavesFromNow = data.hours.splice(timeIndexSplit);

            // here we caluclate three days into the future from current hour
            // this is done by taking the waves from now lenght which is 228
            // then subtracting 156 to get 72 hours
            let lengthForThreeDaysFromNow = wavesFromNow.length - 156;

            for (let i = 0; i < lengthForThreeDaysFromNow; i++) {

                // can do something where i split by the T and match the date and anything less than the current hour would be a darker or something where the opacity is a bit less - signify that the time has already pass but there definitely has to be a way ignore the hours before, perhpas by designating a value to them and if they have a certain value like 0 or true, then they are not added to the three day four cast - but also have to think about if there is a way to do this, and then assign the length based off of how many hours of the day have already passed -Jeff

                let surfDataArray = wavesFromNow[i];

                // swell Data
                let swellDirectionArrayLength = 0;
                let swellHeightArrayLength = 0;
                let swellPeriodArrayLength = 0;
                let swellDirectionArray = [];
                let swellHeightArray = [];
                let swellPeriodArray = [];
                let averageSwellDirection = calculateAverageNumberLoop(surfDataArray.swellDirection, swellDirectionArray, swellDirectionArrayLength);
                let averageSwellHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.swellHeight, swellHeightArray, swellHeightArrayLength)).toFixed(2);
                let averageSwellPeriod = calculateAverageNumberLoop(surfDataArray.swellPeriod, swellPeriodArray, swellPeriodArrayLength);

                // wave height data
                let waveHeightArrayLength = 0;
                let waveHeightArray = [];
                let averageWaveHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.waveHeight, waveHeightArray, waveHeightArrayLength)).toFixed(2);

                //wave period
                let wavePeriodArrayLength = 0;
                let wavePeriodArray = [];
                let averagewavePeriod = calculateAverageNumberLoop(surfDataArray.wavePeriod, wavePeriodArray, wavePeriodArrayLength);

                // wind data
                let windSpeedArrayLength = 0;
                let windDirectionArrayLength = 0;
                let windSpeedArray = [];
                let windDirectionArray = [];
                let averageWindSpeed = (2.23694 * calculateAverageNumberLoop(surfDataArray.windSpeed, windSpeedArray, windSpeedArrayLength)).toFixed(2);
                let averageWindDirection = calculateAverageNumberLoop(surfDataArray.windDirection, windDirectionArray, windDirectionArrayLength);

                // current direction data
                let currentDirectionArrayLength = 0;
                let currentSpeedArrayLength = 0;
                let currentDirectionArray = [];
                let currentSpeedArray = [];
                let averageCurrentDirection = calculateAverageNumberLoop(surfDataArray.currentDirection, currentDirectionArray, currentDirectionArrayLength);
                let averageCurrentSpeed = (2.23694 * calculateAverageNumberLoop(surfDataArray.currentSpeed, currentSpeedArray, currentSpeedArrayLength)).toFixed(2);

                // getting cardinal directions from degress 
                let cardinalSwellDirection = getCardinalDirection(averageSwellDirection);
                let cardinalCurrentDirection = getCardinalDirection(averageCurrentDirection);
                let cardinalWindDirection = getCardinalDirection(averageWindDirection);

                // console.log(surfDataArray.time)

                let splitDate = surfDataArray.time.split("T")[0];
                let hourFromNow = surfDataArray.time.split("T")[1].split(":")[0];
                timeFromNow = calculateHours(hourFromNow, splitDate);

                surfData = new Surf(surfDataArray.seaLevel, cardinalSwellDirection, averageSwellHeight, averageSwellPeriod, timeFromNow, averageWaveHeight, averagewavePeriod, averageWindSpeed, cardinalWindDirection, cardinalCurrentDirection, averageCurrentSpeed);

                let threeDayPrint = $('#three-day-forecast');

                // print to page
                const threeDayForecastCard = `
                <div id="current-card-list">
                    <h3>${surfData.time}</h3>
                    <h4>Wave Height: ${surfData.waveHeight} ft</h4>
                    <h4>Wave Period: ${surfData.wavePeriod} seconds</h4>
                    <p>Current Direction: ${surfData.currentDirection} </p>
                    <p>Current Speed: ${surfData.currentSpeed} mph </p>
                    <p>Swell Direction: ${surfData.swellDirection}</p>
                    <p>Swell Height: ${surfData.swellHeight} ft</p>
                    <p>Swell Period: ${surfData.swellPeriod} seconds</p>
                    <p>Sea Level: ${surfData.seaLevel} ft above (avg. sea sevel)</p>
                    <p>Wind Speed: ${surfData.windSpeed} mph (10m above sea level) </p>
                    <p>Wind Direction: ${surfData.windDirection} </p>
                </div>
            `;

                threeDayPrint.append(threeDayForecastCard)
                hourlySurfData.push(surfData);

            };

        })
        .catch(err => {
            console.error(err);
        });
};

// UNCOMMENT TO RUN MARINE FUNCTION
fetchWaveForecastData(lat, lon, storedCity);
// fetchTideData(lat,lon)

const calculateAverageNumberLoop = (data, emptyArray, arrayLength) => {

    for (let j = 0; j < data.length; j++) {
        emptyArray.push(data[j].value)
        arrayLength = data.length;
    };

    // console.log(emptyArray, "swell direction array?");

    const sumOfArray = emptyArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return averageNumber = Number((sumOfArray / arrayLength).toFixed(2));
} 
