const router = require('express').Router();
const {
  getRandomNumber,
  createEmail,
  deleteAllEmails,
} = require('./controllers');

router.route('/random-number').get(getRandomNumber);
router.route('/emails').post(createEmail).delete(deleteAllEmails);

router.route('/images/:image').get(getImage);

function getImage(req, res) {
  const { image } = req.params;
  res.sendFile(__dirname + '/images/' + image);
}

module.exports = router;
