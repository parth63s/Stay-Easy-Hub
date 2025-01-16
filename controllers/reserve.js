const Listing = require("../models/listing");
const Reserve = require("../models/reserve");

// rander reserve page
module.exports.renderReserveForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        });
    res.render("listing/calculate.ejs", {listing});
};

//calculate total price
module.exports.calculatePrice = async (req, res) => {
    let reserve = req.body.reserve;
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        });
    const startDate = new Date(reserve.startDate);
    const endDate = new Date(reserve.endDate);
    const timeDifference = endDate - startDate;
    const nights = timeDifference / (1000 * 60 * 60 * 24);
    if(nights < 1) {
        req.flash("error", "Please Enter Right Date!");
        return res.redirect(`/listings/${id}/calculate`);
    }
    res.render("listing/reserve.ejs", {listing, reserve, nights});
};

// save reserve 
module.exports.reserveListing = async (req, res) => {
    let { id } = req.params;

    // Fetch the listing
    const listing = await Listing.findById(id)
        .populate ({
            path: "booking"
        });
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    // Create new booking
    const newBooking = new Reserve(req.body.reserve);
    newBooking.author = req.user._id;
    newBooking.listing = id

    const startDate = new Date(newBooking.startDate);
    const endDate = new Date(newBooking.endDate);
    const timeDifference = endDate - startDate;
    const nights = timeDifference / (1000 * 60 * 60 * 24);
    newBooking.nights = nights;
    
    // Save booking and update listing
    function isOverlap(start1, end1, start2, end2) {
        return start1 <= end2 && start2 <= end1;
    }
    let overlapFound = false;
    for (const reserve of listing.booking) {
        if (isOverlap(new Date(reserve.startDate),new Date(reserve.endDate), startDate, endDate)) {
            overlapFound = true;
            break; // Exit loop if overlap is found
        }
    }
    if(overlapFound) {
        req.flash("error", "Already Reserved!");
        res.redirect(`/listings/${id}`);
    } else {
        listing.booking.push(newBooking);
        await newBooking.save();
        await listing.save();
    
        req.flash("success", "Booking is completed!");
        res.redirect(`/listings/${listing._id}`);
    }
};