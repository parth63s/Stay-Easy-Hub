const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");


// index route
router.get(
    "/",
    wrapAsync(async (req,res) => {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", {allListings});
    })
);


//new route
router.get("/new", isLoggedIn, (req,res) =>{
    res.render("listing/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", {listing});
}));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next)=> {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listing/edit.ejs", {listing});
}));


// update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}))


// delete route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync( async (req, res) => {
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router