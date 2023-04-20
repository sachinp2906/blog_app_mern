const mongoose = require('mongoose')
const dotenv = require('dotenv')
const MONGO_URI = process.env.MONGO_URI

const connectDB = ()=>{
mongoose
  .connect(
    "mongodb+srv://sachinfu:2906@sachinfu.fcpe6tc.mongodb.net/blog-database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("connected with blog database");
  })
  .catch((err) => {
    console.log(err);
  });
}

module.exports.connectDB = connectDB