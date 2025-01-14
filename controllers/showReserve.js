const Listing = require("../models/listing");
const Reserve = require("../models/reserve");

//Show All Booking
module.exports.renderBookingForm = async (req, res) => {   
    const id = req.user._id;
    const listOfReserve = await Reserve.find({ author: id })
        .populate({
            path: "listing", // Populate the `listing` reference in the `Reserve` model
        });
    if(listOfReserve.length === 0) {
        req.flash("error", "Book a Place!");
        res.redirect("/listings");
    } 

    res.render("./listing/booking.ejs", { listOfReserve });
};

//destroy booking(Unreserve)
module.exports.destroyBooking = async (req,res) => {
    let {id} = req.params;
    await Reserve.findByIdAndDelete(id);

    req.flash("success", "Reserve listing is Unreserve.");
    res.redirect("/reserve");   
};

