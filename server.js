const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
// const router = require("./routes/html-routes");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const Transaction = require("./models/transaction.js");

// middleware
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || "mongodb://localhost/budget",
 {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => console.log("DB Connected!"));

// routes
app.use(require("./routes/api.js"));
//router(app);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});