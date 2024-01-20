const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const routes = require("./routes");

// load .env config
dotenv.config();
const app = express();

// middileware to parse json format request body
app.use(express.json());
app.use("/api", routes);
const PORT = process.env.PORT ? process.env.PORT : 3000;

async function connectToDB() {
  await mongoose.connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/bookingDB?authSource=admin`
  );
}

async function main() {
  try {
    await connectToDB();
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    throw err;
  }
}

main();
