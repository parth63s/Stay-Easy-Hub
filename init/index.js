const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
        console.log("Data was initialized");
    }).catch((err) => {
        console.error("Error initializing data:", err);
    });

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (err) {
        throw new Error("Failed to connect to MongoDB");
    }
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: "66a756a93ecced7d4c9b4579"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    
}

initDB();