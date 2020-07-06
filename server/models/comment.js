var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text: String,
    comments: String,
    start: { type: Date, default: Date.now },
    end: { type: Date, default: Date.now },
    x1: Number, 
    x2: Number, 
    color: String,
}, { timestamps: true });

commentSchema.statics.findIntersectingComments = function (d1, d2) {
    return this.find(
        {
            $or: [
                { start: { $lt: d1 }, end: { $gt: d1 } }, // s < d1 && e > d1 // d1 between s and e
                { start: { $gt: d1 }, end: { $lt: d2 } }, // s > d1 && e < d2 // inside
                { start: { $lt: d2 }, end: { $gt: d2 } }, // s < d2 && e > d2 // d2 between s and e
            ]
        }
    )
}



const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

