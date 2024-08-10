const express=require("express")
const router=express.Router({mergeParams:true})
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const { createReviwRoute, deleteReviewRoute } = require("../controllers/review.js");

//  Review Create Route
router.post("/",isLoggedIn,validateReview,createReviwRoute)

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,deleteReviewRoute)

module.exports=router