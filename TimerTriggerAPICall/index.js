module.exports = async function (context, myTimer) {
    var redis = require('redis');
    var fetch = require('cross-fetch');
    var moment = require('moment-timezone');
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
    
    const REDIS_URL = '***REMOVED***'
    const API_URL = "https://api.em6.co.nz/ords/em6/data_api/region/price/"

    getapi();

    async function getapi() {
        const response = await fetch(API_URL);
        let data = await response.json();
        sortData(data) 
    }

    function sortData(data){

        let jsonComplete = [];
        let jsonData = [];
        let jsonMetadata = [];
        let date = moment().tz("Pacific/Auckland").format("YYYY.MM.DD");
        let time = moment().tz("Pacific/Auckland").format("HH:mm");
        let corTZ = moment().tz("Pacific/Auckland").format("HH:mm|TZ");
        let borkedTime = data['items'][0]['timestamp']
        borkedTime = borkedTime.slice(0, -1)
        borkedTime = borkedTime.split('T')
        let timeSplitter = borkedTime[1]
        borkedHour = timeSplitter.split(':')
        if (time >= "12:00"){var hour24 = Number(borkedHour[0]) + 12} else {var hour24 = borkedHour[0]}
        let twentyFourTime = hour24 + ":" + borkedHour[1] + ":" + borkedHour[2]  
        jsonMetadata.push({date, corTZ}) 

        for (var keys of data['items'])
        {
            var map = new Map(Object.entries(keys));
            let gridName = map.get('grid_zone_name')
            let gridPrice = map.get('price')
            jsonData.push({gridName, gridPrice})    
        }

        jsonComplete.push({jsonMetadata})
        jsonComplete.push({jsonData})
        let key = date + "|" + twentyFourTime
        var json = JSON.stringify(jsonComplete);

        databaseEntry(json, key)
    }

async function databaseEntry(json,key){

    let client = redis.createClient({url: REDIS_URL});
    client.connect()
    client.on("error", function(err){
    console.log("Something went wrong ", err)});
    console.log("Connected to local Redis Database")
    console.log(key)
    if (await client.exists(key) == "0"){
    client.set(key, json)
    results = "Record Added"
    }
        else{results = "Error: Record exists, try again later"}  
    console.log(results)
    client.QUIT
    console.log("Disconnected from Database")
    }

};