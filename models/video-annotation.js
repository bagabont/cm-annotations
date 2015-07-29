var mongoose = require('mongoose'),
    CommentSchema = require('./comment');

var VideoAnnotationSchema = new mongoose.Schema({
    video_id: {type: String, required: true},
    date_created: {type: Date},
    date_modified: {type: Date},
    author: {type: String, required: true},
    text: {type: String, required: true},
    start: {type: Number, required: true},
    end: {type: Number, required: true},
    is_inline: {type: Boolean},
    position: {
        top: {type: String},
        left: {type: String}
    },
    size: {
        width: {type: String},
        height: {type: String}
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
