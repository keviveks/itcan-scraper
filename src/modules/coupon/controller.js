const path = require('path');
const couponModel = require('./model');

exports.home = async (req, res, next) => {
  try {
    const coupons = await couponModel.couponData();

    return res.render(path.resolve(__dirname + '/view.pug'), { coupons });
  } catch (error) {
    console.log(error);
  }
}
