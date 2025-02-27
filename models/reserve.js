    const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reserveSchema = new Schema({
    startDate: Date,
    endDate: Date,
    nights : Number,
    listing: {                    // Store listing 
        type: Schema.Types.ObjectId,
        ref: "Listing"
    },
    author: {                    // Store Owner
        type: Schema.Types.ObjectId,
        ref: "User",
    }

})

module.exports = mongoose.model("Reserve", reserveSchema);         // create model