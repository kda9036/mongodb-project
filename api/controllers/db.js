const MongoClient = require("mongodb").MongoClient;
const mongo = require("mongodb");
require("dotenv").config();

const connectionString = `mongodb://${process.env.MONGO_PORT}`;
console.log(connectionString);

const client = new MongoClient(connectionString);

exports.getUsers = async function () {
  try {
    await client.connect();
    const db = client.db("admin");
    const users = db.collection("system.users");

    var results = await users.find({}).toArray();
    console.log(results);
    return results;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

exports.getReports = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("IncidentReports");
    const reports = db.collection("Reports");

    var results = await reports.find().limit(30).toArray();

    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify(results));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

exports.getImage = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("IncidentReports");
    const bucket = new mongo.GridFSBucket(db);

    const stream = bucket.openDownloadStreamByName(req.params.name);
    stream.on("data", (chunk) => {
      res.write(chunk);
    });
    stream.on("end", () => {
      res.status(200).end();
      client.close();
    });
    stream.on("error", (err) => {
      console.log(err);
      res.status(500).send(err);
      client.close();
    });
  } catch (e) {
    console.error(e);
    client.close();
  }
};

exports.getReportById = async function (req, res) {
  try {
    await client.connect();

    const db = client.db("IncidentReports");
    const reports = db.collection("Reports");

    // To query on ID, you need to create a new ObjectId instance
    const id = new mongo.ObjectId(req.params.id);
    var results = await reports.find({ _id: id }).toArray();

    res.header("Content-Type", "application/json");

    return res.send(JSON.stringify(results));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

// find a word within IncidentDescription
// full word, case insensitive, word on its own or at the start of another word
exports.getReportsBySearchTerm = async function (req, res) {
  try {
    await client.connect();

    const db = client.db("IncidentReports");
    const reports = db.collection("Reports");

    ///search
    const term = req.body.term;
    const regex = RegExp(`\\b${term}`, "i");
    var results = await reports.find({ IncidentDescription: regex }).toArray();

    res.header("Content-Type", "application/json");

    return res.send(JSON.stringify(results));
    /// search
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

exports.appendComment = async function (req, res) {
  try {
    await client.connect();

    const db = client.db("IncidentReports");
    const reports = db.collection("Reports");

    const name = req.body.name;
    const comment = req.body.comment;
    console.log(name, comment)
    const date = new Date().toJSON();

    console.log(req.params.id)
    const id = new mongo.ObjectId(req.params.id);

    const filter = { _id: id };
    const options = { upsert: false };

    const updateDoc = {
      $push: {
        Comments: {
          Date: date,
          Name: name,
          Text: comment,
        }
      },
    };

    const result = await reports.updateOne(filter, updateDoc, options);

    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );

    res.send(result);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

exports.getReportsByLocation = async function (req, res) {
  try {
    await client.connect();

    const db = client.db("IncidentReports");
    const reports = db.collection("Reports");

    const lat = parseFloat(req.body.lat);
    const long = parseFloat(req.body.long);
    const distance = parseInt(req.body.distance);

    res.set("Content-Type", "application/json");
    const results = await reports
      .find({
        GeoLocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
            $maxDistance: distance,
          },
        },
      })
      .toArray();

    return res.json(results);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};
