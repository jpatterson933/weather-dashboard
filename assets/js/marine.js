// const moment = require("moment");

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



// /* function to map directions to cardinal map */
const getCardinalDirection = (angle) => {
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(angle / 45) % 8];
}

// surf class
class Surf {
    constructor(seaLevel, swellDirection, swellHeight, swellPeriod, time, waveHeight) {
        this.seaLevel = seaLevel[0].value;
        this.swellDirection = swellDirection;
        this.swellHeight = swellHeight;
        this.swellPeriod = swellPeriod;
        this.time = time;
        this.waveHeight = waveHeight;
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

const dataLoading = (status, element) => {
    if (status === true) {
        element.style.display = "block";
    } else if (status === false) {
        element.style.display = "none";
    }
}

// get current hour
const getCurrentHourIso = () => {
    let currentDate = moment().format();
    // console.log(currentDate)
    return currentHourIso = currentDate.split(":")[0];
};

const fetchWaveForecastData = (latitude, longitude, savedCity) => {


    const url = "https://stormglass.p.rapidapi.com/forecast?lat=";
    const params = 'swellHeight,swellDirection,swellPeriod,waveHeight,seaLevel';
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


            // console.log(response, "response");
            // console.log(response.json(), "json repsonse")
            return response.json();
        })
        .then((data) => {
            console.log(data, "data response")
            showLoadSymb = false;
            dataLoading(showLoadSymb, loading)

            for (let i = 0; i < 72; i++) {

                console.log(data.hours[i].time)
                let dateAndHourNow = getCurrentHourIso();
                console.log(dateAndHourNow)
                // if dateandhournow match the current date and hour now, then we make something happen

                let surfDataArray = data.hours[i];

                let swellDirectionArrayLength = 0;
                let swellHeightArrayLength = 0;
                let swellPeriodArrayLength = 0;
                let waveHeightArrayLength = 0;
                let swellDirectionArray = [];
                let swellHeightArray = [];
                let swellPeriodArray = [];
                let waveHeightArray = [];

                let averageSwellDirection = calculateAverageNumberLoop(surfDataArray.swellDirection, swellDirectionArray, swellDirectionArrayLength);
                let averageSwellHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.swellHeight, swellHeightArray, swellHeightArrayLength)).toFixed(2);
                let averageSwellPeriod = calculateAverageNumberLoop(surfDataArray.swellPeriod, swellPeriodArray, swellPeriodArrayLength);
                let averageWaveHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.waveHeight, waveHeightArray, waveHeightArrayLength)).toFixed(2);

                let cardinalSwellDirection = getCardinalDirection(averageSwellDirection)

                // console.log(surfDataArray.time)

                let splitDate = surfDataArray.time.split("T")[0];
                let hourFromNow = surfDataArray.time.split("T")[1].split(":")[0];
                timeFromNow = calculateHours(hourFromNow, splitDate);



                surfData = new Surf(surfDataArray.seaLevel, cardinalSwellDirection, averageSwellHeight, averageSwellPeriod, timeFromNow, averageWaveHeight);

                let threeDayPrint = $('#three-day-forecast');

                // console.log(surfData.seaLevel)

                const threeDayForecastCard = `
                <div id="current-card-list">
                    <div>${surfData.time}</div>
                    <div>Sea Level: ${surfData.seaLevel} ft above MSL (Avg. Sea Level)</div>
                    <div>Swell Direction: ${surfData.swellDirection}</div>
                    <div>Swell Height: ${surfData.swellHeight} ft</div>
                    <div>Swell Period: ${surfData.swellPeriod} Seconds</div>
                    <div>Wave Height: ${surfData.waveHeight} ft</div>
                </div>
            `;

                threeDayPrint.append(threeDayForecastCard)
                hourlySurfData.push(surfData);

            };

        })
        .catch(err => {
            console.error(err);
        });
}


// might be able to fetch tide data here
// const fetchTideData = (latitude, longitude) => {

//     const url = "https://api.stormglass.io/v2/tide/stations"

//     let query = `${url}`

//     console.log(query)

//     fetch(query, {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-host": "stormglass.p.rapidapi.com",
//             "x-rapidapi-key": API_KEY
//         }
//     })
//         .then(response => {
//             console.log(response);
//             return response.json()
//         })
//         .then((data) => {

//         })
//         .catch(err => {
//             console.error(err);
//         });
// }





// UNCOMMENT TO RUN MARINE FUNCTION
fetchWaveForecastData(lat, lon, storedCity);
// fetchTideData(lat,lon)

console.log(hourlySurfData, "hours surf data")
// console.log(hourlySurfData.surfData.seaLevel)


//make the next url include the lat and lon to create the forecast url -- we also exclude hourly and minutely data so we only get daily

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
