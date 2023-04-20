const express = require('express')
const app = express()
const database = require('./database/database')
const mongoose = require('mongoose')
const routes = require('./src/routes/routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const PORT =  process.env.PORT || 3001
app.use(express.json())
app.use(cookieParser())
dotenv.config()

database.connectDB()
app.use('/' , routes)

app.listen(PORT , ()=>{
    console.log('server running on PORT ' , PORT)
}) 

