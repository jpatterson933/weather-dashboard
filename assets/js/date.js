function readableDate(x) {
    let unixTimeStamp = x.trim();
    let dateObject = new Date(unixTimeStamp * 1000);
    let readableDate = {
        day: dateObject.toLocaleString('en-US', { weekday: 'long' }),
        month: dateObject.toLocaleString('en-US', { month: 'long' }),
        dayNum: dateObject.toLocaleString('en-US', { day: 'numeric' })
    }
    let oneDate = `${readableDate.day} ${readableDate.month} ${readableDate.dayNum}`

    console.log(oneDate, "--------------- new function")
    return oneDate;
}