const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingControler = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({storage})

router.route("/")
    .get(wrapAsync(listingControler.index))     //show All Listing
    .post(isLoggedIn,                           //create listing
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingControler.createListing)
    );
    
//new route
router.get("/new", isLoggedIn, listingControler.renderNewForm);     // render a new listing page

router.route("/:id")
    .get(wrapAsync(listingControler.showListing))           //show Listing
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControler.updateListing))      //edit Listing
    .delete(isLoggedIn, isOwner,wrapAsync(listingControler.destroyListing));             // delete Listing

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControler.renderEditForm));     //  render edit form

module.exports = router