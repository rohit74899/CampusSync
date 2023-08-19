const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/Audience").then(()=>{
//     console.log("connecction is succesfull")
// })   
// .catch((e)=>{
//     console.log(e);
// })

mongoose.connect("mongodb+srv://mern_proj:12345@cluster0.9kteqvb.mongodb.net/mern_data?retryWrites=true&w=majority").then(()=>{
    console.log("connecction is succesfull")
})   
.catch((e)=>{
    console.log(e);
})