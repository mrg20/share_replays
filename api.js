var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/*API listing*/
router.get('/video', function(req, res) {
  var path = 'sample.webm';
  var stat = fs.statSync(path);
  var fileSize = stat.size;
  var range = req.headers.range;

  if (range) {
    var parts = range.replace(/bytes=/, "").split("-");
    var start = parseInt(parts[0], 10);
    var end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;
    var chunksize = (end-start)+1;
    var file = fs.createReadStream(path, {start, end});
    var head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/webm',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    var head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/webm',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;