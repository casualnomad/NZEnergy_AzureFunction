
const { Redis } = require('redis')
module.exports = async function (context, req) {
    

    console.log("Trying to connect")
    
    const REDIS_URL = '***REMOVED***'
    const cloudClient = Redis.createClient({url: '***REMOVED***'})
    await cloudClient.connect()
    cloudClient.on("error", function(err){
        console.log("Something went wrong ", err)});
    console.log("Connected to Cloud Redis Database")
    cloudClient.set("hi","There")
    cloudClient.quit()

}