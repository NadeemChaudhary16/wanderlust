const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js")

// Create Route
const createReviwRoute=wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id
    listing.review.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","new review created")
    console.log("new review saved")
    res.redirect(`/listings/${listing._id}`)
   })

//    Delete Route
const deleteReviewRoute=wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listings/${id}`)
})
module.exports={
    createReviwRoute,
    deleteReviewRoute
}