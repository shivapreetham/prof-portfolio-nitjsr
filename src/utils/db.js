// db.js - MongoDB Connection File
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/yourDatabase";

if (!global._mongoose) {
    global._mongoose = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("MongoDB Connected")).catch(err => console.error(err));
}

export default global._mongoose;
