const MongoClient = require("mongodb").MongoClient;

const router = require("express").Router();
const db = require("../controllers/db");

const connectionString = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_PORT}`;

const client = new MongoClient(connectionString);

router.get("/test", async (req, res) => {
  console.log(db);
  res.send("Hi");
});

router.get("/reports", db.getReports);

router.get("/reports/:id", db.getReportById);

router.get("/images/:name", db.getImage);

router.post("/reports/search", db.getReportsBySearchTerm);
router.post("/reports/location", db.getReportsByLocation);
router.put("/appendComment/:id", db.appendComment);

module.exports = router;
