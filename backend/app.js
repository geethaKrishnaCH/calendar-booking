const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const { notFound, errorHandler } = require("./services/middleware");
// load .env config
dotenv.config();
const { transporter } = require("./services/email/emailUtil");

const app = express();
app.use(
  cors({
    origin: "*", // Specify allowed origins
    credentials: true, // Allow sending credentials
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT ? process.env.PORT : 3000;

async function connectToDB() {
  // await mongoose.connect(
  //   `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/bookingDB?authSource=admin`
  // );
  await mongoose.connect(process.env.MONGO_URL);
}

async function main() {
  try {
    await connectToDB();
    console.log("Connected to database");
    transporter.verify((error, success) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email server connection successful!");
      }
    });
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    throw err;
  }
}

main();
