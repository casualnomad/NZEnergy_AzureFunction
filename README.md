# Energy Function App

This is the same as oneof my test private repos but has been cleansed and modified to run with Azure Function App using Timer Triggers. 

This runs once every 30 minutes,at 15 minutes past the hour.

It takes the EM6 data for NZ power prices, cleans up the JSON, sets the correct 24 hour time and puts it into a redis cloud database.

#Still a work in testing. 
