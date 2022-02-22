module.exports = async function (context, myTimer) {

    var moment = require('moment-timezone');
    var redis = require('redis');
    var fetch = require('cross-fetch');

    const REDIS_URL = "*Enter REDIS cloud url here (example: redis://[USERNAME (normally 'default')]:[PASSWORD]@[REDIS URL]:[PORT]/0"
    const API_URL = "https://api.em6.co.nz/ords/em6/data_api/region/price/"

    getapi();

    async function getapi() {
        const response = await fetch(API_URL)
        try{
         let data = await response.json();
         sortData(data) 
        } catch (err) {
            console.error("Something went wrong")
            console.error(err)
        }
    }

    function sortData(data){

        let jsonComplete = []
        let jsonData = []
        let jsonMetadata = []
        let utzTime = data['items'][0]['timestamp']
        let nztzTime = moment.tz(utzTime, "Pacific/Auckland").format()
        let displayTime = utzTime.slice(0, -1)
        displayTime = displayTime.replace("T", "|") 
        jsonMetadata.push({"UTZtimestamp" : utzTime}) 
        jsonMetadata.push({"NZTZtimestamp" : nztzTime}) 

        for (var keys of data['items'])
        {
            var map = new Map(Object.entries(keys))
            let gridName = map.get('grid_zone_name')
            let gridPrice = map.get('price')
            jsonData.push({gridName, gridPrice})    
        }

        jsonComplete.push({jsonMetadata})
        jsonComplete.push({jsonData})
        let key = displayTime
        var json = JSON.stringify(jsonComplete)

        databaseEntry(json, key)
    }

    async function databaseEntry(json,key){

        let client = redis.createClient({url: REDIS_URL})
        client.connect()
        client.on("error", function(err){
        console.log("Something went wrong ", err)})
        console.log("Connected to cloud Redis Database")
        if (await client.exists(key) == "0"){
            client.set(key, json)
            results = "Record Added"
        } else {results = "Error: Record exists, try again later"}  
        console.log(results)
        client.QUIT
        console.log("Disconnected from Database")
        }

};