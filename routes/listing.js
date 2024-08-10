const express=require("express")
const router=express.Router()
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const { indexRoute, newRoute, createRoute, showRoute, editRoute, updateRoute, deleteRoute } = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(indexRoute)       // Index Route
.post(isLoggedIn,upload.single("image"),validateListing,createRoute);     // Create Route


// New Route
router.get("/new",isLoggedIn,newRoute);


router.route("/:id")
.get(showRoute)           // Show Route
.put(isLoggedIn,isOwner,upload.single("image"),validateListing,updateRoute)        // Update Route
.delete(isLoggedIn, isOwner,deleteRoute);

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,editRoute);            // Delete Route




module.exports=router