var express = require('express');
var csv = require('csvtojson');
var moment = require('moment');
var router = express.Router();
var Comment = require('../models/comment');
const { emit } = require('../socket');

router.get('/chart-data', async function (req, res) {
    const data = await csv().fromFile('./public/chart-data.csv');
    res.json(data.map(d => ({ ...d, date: moment(d.date, 'D-MMMM-YYYY').toDate() })))
    let allComments = await Comment.find({});
    emit('all-comments', allComments);
});

router.get('/comment', async function (req, res) {
    const queryParams = req.query;
    let comments = await Comment.findIntersectingComments(new Date(queryParams.d1), new Date(queryParams.d2));
    res.json(comments.map(c => c.text));
});

router.post('/comment', async function (req, res) {
    const body = req.body;
    const newComment = new Comment({
        start: new Date(body.d1),
        end: new Date(body.d2),
        text: body.comment,
        x1: body.x1,
        x2: body.x2,
        color: body.color,
    })
    let comment = await newComment.save();
    emit('new-comment', comment);
    res.status(200).send();
});

module.exports = router;
