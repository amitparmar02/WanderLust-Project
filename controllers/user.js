const User = require("../models/user.js");


module.exports.signupUser =(req,res)=>{
    res.render("users/signup.ejs")
};


module.exports.signupCreate = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const rgsrUser = await User.register(newUser,password);

        req.login(rgsrUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to WenderLust");
            return res.redirect("/listings")
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }

};

module.exports.loginGet = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginPost = async(req,res)=>{
    req.flash("success","Welcome To WanderLust! You are Logged In!!");
    let redUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redUrl);
};

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Logged Out!!");
        return res.redirect("/listings")
    })
};