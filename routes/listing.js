const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingControler = require("../controllers/listings.js");


// index route
router.get("/", wrapAsync(listingControler.index));

//new route
router.get("/new", isLoggedIn, listingControler.renderNewForm);

// show route
router.get("/:id", wrapAsync(listingControler.showListing));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingControler.createListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControler.renderEditForm));

// update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingControler.updateListing));

// delete route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingControler.destroyListing));

module.exports = router