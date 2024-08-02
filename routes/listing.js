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
    .get(wrapAsync(listingControler.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingControler.createListing)
    );
    
//new route
router.get("/new", isLoggedIn, listingControler.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingControler.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControler.updateListing))
    .delete(isLoggedIn, isOwner,wrapAsync(listingControler.destroyListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControler.renderEditForm));

module.exports = router