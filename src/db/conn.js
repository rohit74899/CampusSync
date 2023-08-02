const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Audience").then(()=>{
    console.log("connecction is succesfull")
})   
.catch((e)=>{
    console.log(e);
})