/* 
    Jeffery W. Patterson
    DFBW LLC
*/

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');


let latitude = 34.005;
let longitude = -118.8101;
let savedCity = "Malibu";

function writeToFile(fileName, fileData) {
    fs.writeFile(path.join(__dirname, "./assets/js", fileName), JSON.stringify(fileData), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("100% of Data succssfully saved");
        }
    })
}




const fetchWaveForecastData = (latitude, longitude) => {
    const params = 'swellHeight,swellDirection,swellPeriod,waveHeight,wavePeriod,seaLevel,windSpeed,windDirection,currentDirection,currentSpeed';
    const options = {
        method: 'GET',
        url: `https://stormglass.p.rapidapi.com/forecast?lat=${latitude}&lng=${longitude}&params=${params}`,
        params: { lng: longitude, lat: latitude },
        headers: {
            "x-rapidapi-host": "stormglass.p.rapidapi.com",
            "x-rapidapi-key": process.env.MARINE_KEY
        }
    };


    axios.request(options).then((response) => {
        // console.log(response.data);

        return response.data
    })
        .then((res) => {
            console.log(res)



        })
        .catch((error) => {
            console.log(error);
        })



};

fetchWaveForecastData(latitude, longitude);