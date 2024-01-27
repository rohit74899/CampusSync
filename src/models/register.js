const mongoose=require("mongoose");

const user= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true
        
    },
    password:{
        type:String,
        require:true
        
    
    },
    confirm_pass:{
        type:String,
        require:true

    }
})


// we create a collection
Register_user =mongoose.model("Register_user",user);

module.exports=Register_user;