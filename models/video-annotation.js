var mongoose = require('mongoose'),
    CommentSchema = require('./comment');

var VideoAnnotationSchema = new mongoose.Schema({
    video_id: {type: String, required: true},
    date_created: {type: Date},
    date_modified: {type: Date},
    author: {type: String, required: true},
    text: {type: String, required: true},
    start_time: {type: Number, required: true},
    end_time: {type: Number, required: true},
    position: {
        top: {type: Number},
        left: {type: Number}
    },
    comments: [CommentSchema]
});

VideoAnnotationSchema.pre('save', function (next) {
    var now = Date.now();
    if (!this.date_created) {
        this.date_created = now;
    }
    this.date_modified = now;
    next();
});

VideoAnnotationSchema.pre('update', function (next) {
    this.date_modified = Date.now();
    next();
});

module.exports = mongoose.model('VideoAnnotation', VideoAnnotationSchema);