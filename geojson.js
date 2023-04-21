const connection = new Mongo(`localhost:27017`),
    db = connection.getDB(`IncidentReports`),
    reports = db.getCollection(`Reports`);

print( `document count:` );
print(reports.countDocuments());

// unset / remove GeoLocation from all docs
reports.updateMany(
  { },
  { $unset: { GeoLocation: "" } }
)

// add GeoLocation to all docs
reports.updateMany(
  {},
  // use aggregation pipeline to populate `GeoLocation`
  [
    {
      $set: {
        GeoLocation: {
          // populate `GeoLocation` with null if long or lat doesn't exist
          $cond: {
            if: {
              $or: [
                { $eq: ["$Longitude", ""] },
                { $eq: ["$Latitude", ""] }
              ]
            },
            then: null,
            else: {
              type: "Point",
              coordinates: [ // note longitude is first
                "$Longitude", "$Latitude"
              ]
            }
          }
        }
      }
    }
    // {
    //   $unset: ["longitude", "latitude"] // remove the original properties
    // }
  ]
);

// create index
reports.createIndex({ GeoLocation: "2dsphere" });