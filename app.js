if(process.env.Node_ENV != "Production") {
    require('dotenv').config();
}


const Listing = require("./models/listing.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Reserve = require("./models/reserve.js")


const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create( {
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSTION STORE", err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 *60 * 1000,
        maxAge :  7 * 24 * 60 *60 * 1000,
        httpOnly : true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/sort/:ids", async (req, res) => {
    const {ids} = req.params;
    console.log(ids);
    const allListings = await Listing.find(ids === "all" ? {} : {category: ids});
    res.render("listing/index.ejs", { allListings , ids, searchText:undefined});
})

// app.get("/listings?", (req, res) => {
//     const {q} = req.params;
//     console.log(q);
// })

// app.get("/listing")

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email : "student@gamil.com",
//         username: "delta"
//     });
    
//     let regiteredUser = await User.register(fakeUser, "helloworld");
//     res.send(regiteredUser);

// })


app.get("/listings/:id/calculate", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        });
    res.render("listing/calculate.ejs", {listing});
})
app.post("/listings/:id/calculate", async (req, res) => {
    let reserve = req.body.reserve;
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        });
    console.log(reserve)
    const startDate = new Date(reserve.startDate);
    const endDate = new Date(reserve.endDate);
    const timeDifference = endDate - startDate;
    const nights = timeDifference / (1000 * 60 * 60 * 24);
    if(nights < 1) {
        req.flash("error", "Please Enter Right Date!");
        return res.redirect(`/listings/${id}/calculate`);
    }
    res.render("listing/reserve.ejs", {listing, reserve, nights});
})




app.post("/listings/:id/reserve", async (req, res) => {
    let { id } = req.params;

    // Fetch the listing
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    console.log("Request body:", req.body);

    // Create new booking
    const newBooking = new Reserve(req.body.reserve);
    newBooking.author = req.user._id;

    // Save booking and update listing
    listing.booking.push(newBooking);
    await newBooking.save();
    await listing.save();

    req.flash("success", "Booking is completed!");
    res.redirect(`/listings/${listing._id}`);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080, ()=> {
    console.log("server is listening to port 8080")
})