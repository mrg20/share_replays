const express = require('express');
const router = express.Router();

/*API listing*/
router.get('/video', (req, res) => {
  res.send('the video should be listed here');
});

module.exports = router;