var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
const crypto = require('crypto');

/*API listing*/
router.get('/', function(req, res){
  res.sendFile('upload.html', {root: __dirname });
});

router.get('/video/:id', function(req, res) {
  var path = `./videos/${req.params.id}.webm`;
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


router.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  let sampleFile = req.files.sampleFile;
  console.log(req.files);
  var fileName = crypto.randomBytes(20).toString('hex');
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./videos/${fileName}.webm`, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send(`File uploaded! Url: /video/${fileName}`);
  });
});

module.exports = router;
