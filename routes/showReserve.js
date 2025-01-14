const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const {isLoggedIn} = require("../middleware.js");

const reserveController = require("../controllers/showReserve.js")

//show
router.route("/")
    .get(isLoggedIn, wrapAsync(reserveController.renderBookingForm));

//delete
router.route("/:id")
    .delete(isLoggedIn, wrapAsync(reserveController.destroyBooking));
    
module.exports = router