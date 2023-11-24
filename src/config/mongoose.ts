const mongoose = require('mongoose')
require('dotenv').config()

export const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(process.env.DB_URL);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log(error);
    }
  };