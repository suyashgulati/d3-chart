var express = require('express');
var csv = require('csvtojson');
var moment = require('moment');
var router = express.Router();
var Comment = require('../models/comment');

router.get('/chart-data', async function (req, res) {
    const data = await csv().fromFile('./public/chart-data.csv');
    res.json(data.map(d => ({ ...d, date: moment(d.date, 'D-MMMM-YYYY').toDate() })))
});

router.get('/comment', async function (req, res) {
    const queryParams = req.query;
    let comments = await Comment.findIntersectingComments(new Date(queryParams.d1), new Date(queryParams.d2));
    res.json(comments.map(c => c.text));
});

router.post('/comment', async function (req, res) {
    const body = req.body;
    const newComment = new Comment({ start: new Date(body.d1), end: new Date(body.d2), text: body.comment })
    await newComment.save();
    res.status(200).send();
});

module.exports = router;
