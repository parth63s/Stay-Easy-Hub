const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const {isLoggedIn} = require("../middleware.js");

const reserveController = require("../controllers/showReserve.js")

//show
router.route("/")
    .get(isLoggedIn, wrapAsync(reserveController.renderBookingForm));      //render Booking page 

//delete
router.route("/:id")
    .delete(isLoggedIn, wrapAsync(reserveController.destroyBooking));       // destroy(delete) booking
    
module.exports = router