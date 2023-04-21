const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/routes.js");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
const path = require("path");
const PORT = process.env.PORT || 8000;

// Home page for app
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Compiling SCSS to CSS & making it available
var sass = require("sass");
const result = sass.compile("custom.scss");
app.get("/style.css", function (req, res) {
  res.set({ "Content-Type": 'text/css; filename="style.css"' });
  res.send(result.css);
});

// Making custom JS available
app.get("/frontend-scripts.js", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend-scripts.js"));
});

app.get("/bs.js", function (req, res) {
  res.sendFile(
    path.join(
      __dirname,
      "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    )
  );
});

// API Routing
app.use("/api", router);

// Starting server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is listening on port ${PORT}`);
  } else {
    console.log(`Error: ${error}`);
  }
});
