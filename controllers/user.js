const User=require("../models/user.js")

// Signup Render Route(Get Route)
const renderSignup=(req,res)=>{
    res.render("users/signup.ejs")
  
  }

//   Signup Post Route
const signup=async(req,res)=>{
    try{
    let{username,email,password}=req.body
    const newUser=new User({username,email})
    const registeredUser=await User.register(newUser,password)
    // console.log(registeredUser)
    // Automatically login user when user signup
    req.login(registeredUser,(err)=>{
        if(err){
            return next();
        }
        req.flash("success","Welcome to Wanderlust")
        res.redirect("/listings")

    })
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

// Render Login Form
const renderLogin=(req,res)=>{
    res.render("users/login.ejs")
}
// Login Post Route
const login=async(req,res)=>{
    req.flash("success","You are logged in")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
    }

// Logout Route
const logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
                return next(err)
        }
        req.flash("success","You are logged out!")
        res.redirect("/listings")
    })
}
module.exports={
    renderSignup,
    signup,
    renderLogin,
    login,
    logout
}