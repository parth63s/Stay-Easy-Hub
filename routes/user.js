const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
    .get(userController.renderSignupform)      // render signup page
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginform)    // render login page
    .post( saveRedirectUrl,
        passport.authenticate("local",{         // check user exist or not
            failureRedirect: "/login", 
            failureFlash: true
        }), userController.login);


router.get("/logout",userController.logout);
module.exports = router;