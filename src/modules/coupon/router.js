const controller = require('./controller');

module.exports = (router) => {
  router.route('/home')
    .get(controller.home);

  return router;
};
