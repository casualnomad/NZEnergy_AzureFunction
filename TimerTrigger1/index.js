module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
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
        cloudClient.set("2:"+time,"Test - TimerTrigger")
        cloudClient.quit()
    }
};