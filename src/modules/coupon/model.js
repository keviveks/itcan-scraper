const env = require('../../config/env');
const database = require('../../config/libs/database');

const db = database.connect(env.dbPath);

exports.couponData = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM coupons", (err, coupons) => {
      if (err) {
        return reject(err);
      }
      return resolve(coupons);
    });
  });
}


exports.insertCoupon = async (data) => {
  const stmt = db.prepare("INSERT INTO coupons (couponId, code, title, description, brand, dateCreated) VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(Object.values(data));
  stmt.finalize();
}
