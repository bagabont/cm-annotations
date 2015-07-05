var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    date_created: {type: Date},
    date_removed: {type: Date},
    author: {type: String, required: true},
    text: {type: String, required: true}
});

CommentSchema.pre('save', function (next) {
    var now = Date.now();
    if (!this.date_created) {
        this.date_created = now;
    }
    this.date_modified = now;
    next();
});

CommentSchema.pre('update', function (next) {
    this.date_modified = Date.now();
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);
