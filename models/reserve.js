    const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reserveSchema = new Schema({
    startDate: Date,
    endDate: Date,
    listing: {
        type: Schema.Types.ObjectId,
        ref: "listing"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

module.exports = mongoose.model("Reverse", reserveSchema);