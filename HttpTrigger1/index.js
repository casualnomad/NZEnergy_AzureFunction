module.exports = async function (context, req) {

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var Time = time;
    run(time)

    async function run(time){
    
        const Redis = require('redis')
        const REDIS_URL = '***REMOVED***'
        const cloudClient = Redis.createClient({url: REDIS_URL})
        await cloudClient.connect()
        cloudClient.on("error", function(err){
            console.log("Something went wrong ", err)});
        console.log("Connected to Cloud Redis Database")
        cloudClient.set("HTTPTrigger:"+time,"Test - HTTPTrigger" + today)
        cloudClient.quit()
    }

}