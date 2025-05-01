const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");


router.get("/logout",userController.logoutUser);

router.route("/signup")
.get(userController.signupUser)
.post(wrapAsync(userController.signupCreate))

router.route("/login")
.get(userController.loginGet)
.post(saveUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',failureFlash:true
    }),
    userController.loginPost)



module.exports = router;