const sqlite3 = require('sqlite3').verbose();

/**
 * Sqlite Connection Handler
 * @param {String} dbPath database path url
 */
module.exports.connect = (dbPath, setup = false) => {
  const db = new sqlite3.Database(dbPath);
  if (setup) {
    this.initalSetup(db);
  }
  return db;
};

module.exports.initalSetup = (db) => {
  db.run("CREATE TABLE coupons (couponId INTEGER, code TEXT, title TEXT, description BLOB, brand TEXT, dateCreated TEXT)");
  // return new Promise((resolve, reject) => {
  //   // mongoose connect
  //   mongoose.connect(db.uri, db.options)
  //     .then((conn) => {
  //       // mongoes auto increment
  //       autoIncrement.initialize(conn);
  //       resolve(conn);
  //     }, (err) => {
  //       reject(err);
  //     });
  // });
  return db;
}

/**
 * Sqlite Disconnect Handler
 */
module.exports.disconnect = (db) => {
  db.close();
};


// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();
