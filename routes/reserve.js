const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsyc.js");
const {isLoggedIn} = require("../middleware.js");
const reserveController = require("../controllers/reserve.js")

router.route("/calculate")
    .get(isLoggedIn, wrapAsync(reserveController.renderReserveForm))
    .post(isLoggedIn, wrapAsync(reserveController.calculatePrice))

router.route("/", isLoggedIn, wrapAsync(reserveController.calculatePrice));

router.route("/reserve")
    .post(isLoggedIn, wrapAsync(reserveController.reserveListing))
    
module.exports = router