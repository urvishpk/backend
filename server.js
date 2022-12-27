const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");

const port = process.env.PORT;
const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("connected", () => {
  console.log("DB connected!");
});
db.on("error", () => {
  console.log("DB Error");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.listen(port, () => {
  console.log(`Server started at  ${port}`);
});

module.exports = app;
