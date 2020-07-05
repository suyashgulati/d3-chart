var mongoose = require('mongoose');
const connString = 'mongodb://localhost:27017/d3-chart';
mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
    console.log("Connection Successful!");
});

module.exports = db;