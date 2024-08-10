const express=require("express")
const router=express.Router()
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const { renderSignup, signup, renderLogin, logout, login } = require("../controllers/user.js")

router.route("/signup")
.get(renderSignup)     // Render signup
.post(signup)


router.route("/login")
.get(renderLogin)                 // Render login Form
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),login)

// Automatically logout user
router.get("/logout",logout)
module.exports=router