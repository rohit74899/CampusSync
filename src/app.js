const express=require("express");//
const path=require("path");//
const hbs=require("hbs");
const app=express();//
const methodOverride = require('method-override');

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
    '/students',
    '/register',
    '/profile',
    '/addStudent',
    
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

//schema for database
const Register_user=require("./models/register");
const Student = require("./models/student_acadmic"); // Adjust the path

const port=process.env.PORT||3000;//


// this is the most importat part to use files inside the static folder
const static_path=path.join(__dirname,"../public");
// app.use('/assets', express.static(path.join(__dirname, "../public/assets")));
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
app.get("/profile",(req,res)=>{
    res.render("profile");//register page
})
app.get("/addStudent",(req,res)=>{
    res.render("addStudent");//register page
})
app.get("/Notes",(req,res)=>{
    
    res.render("Notes");//register page
})
app.get("/test",(req,res)=>{
    
    res.render("test");//register page
})





// console.log(__dirname);

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



app.patch("/Update_students_marks", async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const subjectName = req.body.subject;
        const newMarks = req.body.marks;
        console.log("Request Body:", req.body);
        

        
        // res.send("Marks updated successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});
app.get('/send_id', (req, res) => {
    const _id = req.query._id;
    res.render('profile', { _id }); // Render the profile page and pass the _id
});

app.patch("/update_marks/:studentId", async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const subjectName = req.body.subject;
        const newMarks = req.body.marks;
        console.log("Request Body:", req.body);
        console.log(subjectName,newMarks);
        // Find the student by ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).send("Student not found.");
        }

        // Find the subject within the student's subjects array
        const subjectToUpdate = student.subjects.find(subject => subject.name === subjectName);

        if (!subjectToUpdate) {
            return res.status(404).send("Subject not found for the student.");
        }

        // Update the marks for the subject
        subjectToUpdate.marks = newMarks;

        // Save the updated student object
        await student.save();
        res.redirect(`/profile/${studentId}`);
        // res.send("Marks updated successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});

app.get('/profile/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render('profile', { student });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
 
app.post("/register_student", async (req, res) => {
    try {
        // Extract data from the request body
        // const { name, email, address, class: TE9, subjects } = req.body;

        // Create a new student object using the Student model
        const newStudent = new Student({
            name:req.body.name,
            Roll_no:req.body.Roll_no,
            address:req.body.address,
            class:req.body.class,
            
        });

        // Save the new student to the database
        const savedStudent = await newStudent.save();
        console.log(savedStudent);
        // res.status(201).json(savedStudent); // Return the created student
        // res.redirect("/addStudent?success=true");
        // res.redirect("addStudent",{success});

        setTimeout(() => {
            res.redirect("/addStudent?warning=true");
        }, 1000);
    } catch (error) {
        console.error("Error registering student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/getdata', async (req, res) => {
    try {
      const documents = await Student.find({});
    //   console.log(documents);
      res.render('students', { documents });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

app.get('/getdata_for_test', async (req, res) => {
    try {
      const documents = await Student.find({});
      console.log(documents);
      res.render('test', { documents });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});





//teacher section
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