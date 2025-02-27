const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listeningSchema = new Schema({       
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        url: String, 
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    category: String,
    reviews: [                      // Store all reviews in listing
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {                        // Store listing Owner
        type: Schema.Types.ObjectId,   
        ref: "User",
    },
    booking : [                     // Store listing Bookings
        {                      
        type: Schema.Types.ObjectId,
        ref: "Reserve",
        }
    ],
});

listeningSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({reviews: {$in: listing.reviews}});
    }
})

const  Listing = mongoose.model("Listing", listeningSchema);        // create model
module.exports = Listing;