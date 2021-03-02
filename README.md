# weather-dashboard

## Assignment Requirements:
GIVEN a weather dashboard with form inputs

WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history

Here I will need a search bar input - that input will need to be pushed onto the end of our url string. 

Once the specific city is found, I will need it to pull that five day forcast and we will need to log that city in our local storage nad have it presented somewhere on the screen.


WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
---

Other Info:                 // UV Index 0 - 2. Low exposure level. Average time it takes to burn: 60 minutes. ...
                            // UV Index 3 - 5. Moderate exposure level. Average time it takes to burn: 45 minutes. ...
                            // UV Index 6 - 7. High exposure level. ...
                            // UV Index 8 - 10. Very high exposure level. ...
                            // 11+ UV Index. Extreme exposure level.
