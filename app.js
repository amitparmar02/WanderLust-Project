if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const db_URL = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected To DB");
}).catch((err)=>{
    console.log(err);
});


async function main() {
    await mongoose.connect(db_URL)
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:db_URL,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter:24*3600,
});


store.on("error",()=>{
    console.log("Error in Mongo DB session Store",err)
})

const sessionOptions={
    store:store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email:"amitparmar@gmail.com",
//         username:"amitparmar"
//     });
//     let rgsrUser = await User.register(fakeuser,"admin");
//     res.send(rgsrUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});



app.use((err,req,res,next)=>{

    let { status = 500 , message = "Something Went Worng !!" } = err;
    // res.status(status).send(message);
    res.render("error.ejs",{message});
  
});


app.listen(8000,()=>{
    console.log("Server is Listening at 8000")
});
