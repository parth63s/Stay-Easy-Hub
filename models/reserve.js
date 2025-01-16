    const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reserveSchema = new Schema({
    startDate: Date,
    endDate: Date,
    nights : Number,
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

})

module.exports = mongoose.model("Reserve", reserveSchema);