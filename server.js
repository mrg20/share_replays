var express = require('express');
var api = require('./api');
var fileUpload = require('express-fileupload');
var app = express();

app.use(fileUpload());
app.use('/', api);

app.listen(process.env.PORT || 8000, function() {
	console.log('Server ON');
});
