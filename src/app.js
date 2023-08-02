const express=require("express");//
const path=require("path");//
const hbs=require("hbs");
const app=express();//
const methodOverride = require('method-override');
const bcrypt =require("bcryptjs");
require("./db/conn");




//session part

const session = require('express-session');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true
}));

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next(); // User is authenticated, allow them to proceed
    } else {
        res.redirect('/login'); // User is not logged in, redirect to login page
    }
};

// Apply authentication middleware to protected routes
const protectedRoutes = [
     // Add URLs of pages you want to protect
    '/index',
    '/students'
];

app.use((req, res, next) => {
    if (protectedRoutes.includes(req.url)) {
        authenticateUser(req, res, next);
    } else {
        next();
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// ... Other middleware setup ...


const Register_user=require("./models/register");

const port=process.env.PORT||3000;//


// this is the most importat part to use files inside the static folder
const static_path=path.join(__dirname,"../public");
app.use(express.static(static_path));

// ****************************************************

const view_path=path.join(__dirname,"../views");
const template_path=path.join(__dirname,"../templates/views");
const partial_path=path.join(__dirname,"../templates/partials")
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(view_path));
app.use(methodOverride('_method'));
app.set("view engine","hbs");
app.set("views",template_path);//now my views folder become template so go to root template and check there 
hbs.registerPartials(partial_path);

app.get("/",(req,res)=>{
    res.render("index");//index page
})
app.get("/index",(req,res)=>{
    res.render("index");//index page
})
app.get("/login",(req,res)=>{
    res.render("login");//login page
})

app.get("/register",(req,res)=>{
    res.render("register");//register page
})
app.get("/students",(req,res)=>{
    res.render("students");//register page
})

console.log(__dirname);

app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.post('/delete/:id', async (req, res) => {
    const documentId = req.params.id;
  
    try {
      const deletedDocument = await Register_user.findByIdAndDelete(documentId);
      if (!deletedDocument) {
        return res.status(404).send('Document delete unsuccess');
      }
      
      console.log(documentId);
      res.redirect('/getdata');
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

app.get('/getdata', async (req, res) => {
    try {
      const documents = await Register_user.find({});
    //   console.log(documents);
      res.render('students', { documents });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        console.log(`${email}  and password is ${password}`)
        const checkdata = await Register_user.findOne({email:email});
        

        console.log(checkdata.password===password);
        if(checkdata){
            if(checkdata.password===password){
                req.session.userId = checkdata._id;//to store userId in session
                res.status(201).render("index",{checkdata});
                console.log(checkdata);
                
            }
            else {
                res.send("Invalid Login details!");
            }
            
        }
        else{
            res.send("Invalid Login details!");
        }
        
        

       
    }catch(e){  
        res.status(404).send(e);
    }
})
app.post("/register",async(req,res)=>{
    try{
            const pass=req.body.password;
            const r_pass=req.body.confirm_pass;
            if(pass===r_pass){
                const user= new Register_user({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    confirm_pass:req.body.confirm_pass  
                })

           

                const saveuser=await user.save();
                res.status(201).render("index");
            }
            else {
                res.send("passwords are not matching!");
            }
                  
        
    }catch(e){
        res.status(404).send(e);
    }
})





app.get("/",(req,res)=>{
    res.send("hello from admin");
})




// const bcryptjs=require("bcryptjs");

// const hashfunction= async(pass)=>{
//     const hashconvert= await bcryptjs.hash(pass,10);
//     console.log(hashconvert);

//     const checkpass= await bcryptjs.compare(pass,hashconvert);
//     console.log(checkpass);

// }
// hashfunction("Rohit@123");

app.listen(port,()=>{
    console.log(`connection is establish at ${port}`);
})