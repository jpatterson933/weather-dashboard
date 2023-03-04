class DailyFC {
    constructor(city, lat, lon, date, dayTemp, eveTemp, maxTemp, minTemp, feelsDay, feelsEve, sunrise, sunset, wndSpd, wndSpdKph, wndDir, wndGust, hmid, dew, uvi, main, desc, icon, timeZone) {
        this.city = city;
        this.lat = lat;
        this.lon = lon;
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

const dailyFC = new DailyFC(
    cityInfo.city,
    cityInfo.lat,
    cityInfo.lon,
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    new Array(),
    res.timezone
);
console.log(dailyFC);
