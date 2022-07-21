// const moment = require("moment");

// import json files
import surfData from "./surfData.json" assert {type: "json"}
// console.log(surfData)

// console.log(surfData.hours[0])

const surf = surfData.hours;
// console.log(surf)

/* Important data for Andres - Surfer Insight
Wave Height, Swell direction, Wind Direction, Tide Height
     -- It is said that these factors are usually predictors of how big waves are */
const hourlySurfData = [];

function parseThruSurfData() {

    for (let i = 0; i < 10; i++) {
        // setting our surfdata
        let surfDataArray = surf[i];

        console.log(surfDataArray.seaLevel)

        let splitDate = surfDataArray.time.split("T")[0];
        let splitTime = surfDataArray.time.split("T")[1].split("+")[0];
        // wave height data
        let averageWaveHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.waveHeight)).toFixed(2);
        //wave period
        let averagewavePeriod = calculateAverageNumberLoop(surfDataArray.wavePeriod);
        // current direction and cardinal current direction
        let averageCurrentDirection = calculateAverageNumberLoop(surfDataArray.currentDirection);
        let cardinalCurrentDirection = getCardinalDirection(averageCurrentDirection);
        // current speed
        let averageCurrentSpeed = (2.23694 * calculateAverageNumberLoop(surfDataArray.currentSpeed)).toFixed(2);
        // swell direction and cardinal swell direction
        let averageSwellDirection = calculateAverageNumberLoop(surfDataArray.swellDirection);
        let cardinalSwellDirection = getCardinalDirection(averageSwellDirection);
        // swell height
        let averageSwellHeight = (3.28084 * calculateAverageNumberLoop(surfDataArray.swellHeight)).toFixed(2);
        // swell period
        let averageSwellPeriod = calculateAverageNumberLoop(surfDataArray.swellPeriod);
        // seal level
        let averageSeaLevel = calculateAverageNumberLoop(surfDataArray.seaLevel)
        // wind speed
        let averageWindSpeed = (2.23694 * calculateAverageNumberLoop(surfDataArray.windSpeed)).toFixed(2);
        // wind direction and cardinal wind direction
        let averageWindDirection = calculateAverageNumberLoop(surfDataArray.windDirection);
        let cardinalWindDirection = getCardinalDirection(averageWindDirection);

        surfCard(splitDate, splitTime, averageWaveHeight, averagewavePeriod, cardinalCurrentDirection, averageCurrentSpeed, cardinalSwellDirection, averageSwellHeight, averageSwellPeriod, averageSeaLevel, averageWindSpeed, cardinalWindDirection);


    };

}

// function to print to page
function surfCard(date, time, waveH, waveP, currD, currS, swellD, swellH, swellP, seaL, windS, windD) {
    let threeDayPrint = $('#three-day-forecast');
    // print to page
    const threeDayForecastCard = `
            <div id="current-card-list">
                <h3>Date: ${date}</h3>
                <h3>Hour: ${time}</h3>
                <h4>Wave Height: ${waveH} ft</h4>
                <h4>Wave Period: ${waveP} seconds</h4>
                <p>Current Direction: ${currD} </p>
                <p>Current Speed: ${currS} mph </p>
                <p>Swell Direction: ${swellD}</p>
                <p>Swell Height: ${swellH} ft</p>
                <p>Swell Period: ${swellP} seconds</p>
                <p>Sea Level: ${seaL} ft above (avg. sea sevel)</p>
                <p>Wind Speed: ${windS} mph (10m above sea level) </p>
                <p>Wind Direction: ${windD} </p>
            </div>
        `;
    threeDayPrint.append(threeDayForecastCard);
    // pushes to our global variable that i set to empty array
    hourlySurfData.push(surfData);
};


const calculateAverageNumberLoop = (data) => {
    let averageNumber;
    let emptyArray = [];
    let arrayLength = 0;
    for (let j = 0; j < data.length; j++) {
        emptyArray.push(data[j].value)
        arrayLength = data.length;
    };

    // console.log(emptyArray, "swell direction array?");

    const sumOfArray = emptyArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);

    return averageNumber = Number((sumOfArray / arrayLength).toFixed(2));
};

// /* function to map directions to cardinal map */
const getCardinalDirection = (angle) => {
    const directions = ['↑ N', 'NNE', '↗ NE', 'ENE', '→ E', 'ESE', '↘ SE', 'SSE', '↓ S', 'SSW', '↙ SW', 'WSW', '← W', 'WNW', '↖ NW', 'NNW'];
    return directions[Math.round(angle / 22.5) % 16];
}

const calculateHours = (addHours, date) => {
    let time;
    return time = moment(date, "YYYY-MM-DD").add(addHours, 'hours').calendar();
}

// grab loading element from html
const loading = document.getElementById("loader");
// set show loading element to null
let showLoadSymb = null;

// Our loading symbol function
const dataLoading = (status, element) => {
    if (status === true) {
        element.style.display = "block";
    } else if (status === false) {
        element.style.display = "none";
    }
}

// main function to run through data
parseThruSurfData();