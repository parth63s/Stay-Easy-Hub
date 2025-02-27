const Listing = require("../models/listing");

// all listing
module.exports.index = async (req,res) => {
    const searchText = req.query.search;
    const choice = req.query.choice;
    const allListings = await Listing.find(choice === "all" || choice === undefined ? {} : {category: choice})
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        });
    console.log(req.query)
    res.render("listing/index.ejs", {allListings, searchText, choice});
}

//render new listing page
module.exports.renderNewForm = (req,res) =>{
    res.render("listing/new.ejs");
}

//render show listing page
module.exports.showListing = async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            }
        })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs", {listing});
}

// add listing in database
module.exports.createListing = async (req, res, next)=> {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

//render Edit page
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requsted for does not exist!");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/h_300,w_250");
    res.render("listing/edit.ejs", {listing, originalImage});
}

//update listing in database
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing  = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {    
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//delete listing in database
module.exports.destroyListing = async (req, res) => {
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}