const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// Index Route
const indexRoute = wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// New Route
const newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

// Create Route
const createRoute = wrapAsync(async (req, res) => {

  let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()
  
        // Log the response from Mapbox to ensure we are receiving the correct data
        console.log("Mapbox Response:", response.body.features);

  const { path: url, filename } = req.file; // Use `path` instead of `url` as multer uses `path`
  console.log('File:', req.file);
  console.log(url, "...", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry
 
    // Verify the geometry object
  console.log("Geometry:", newListing.geometry);
  await newListing.save();
  req.flash("success", "new listing created");
  res.redirect("/listings");
});

// Show Route
const showRoute = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist");
    res.redirect("/listings");
  }
  // console.log("Listing geometry:", listing.geometry);
  res.render("listings/show.ejs", { listing });
});

// Edit Route
const editRoute = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist");
    res.redirect("/listings");
  }
  let originalImgUrl=listing.image.url
  originalImgUrl=originalImgUrl.replace("/upload","/upload/h_100,w_150/e_blur:300")

  res.render("listings/edit.ejs", { listing,originalImgUrl });
});

// Update Route
const updateRoute = wrapAsync(async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const { path: url, filename } = req.file;
    console.log('Updated File:', req.file);
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing edited");
  res.redirect(`/listings/${id}`);
});

// Delete Route
const deleteRoute = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
});
module.exports = {
  indexRoute,
  newRoute,
  createRoute,
  showRoute,
  editRoute,
  updateRoute,
  deleteRoute,
};
