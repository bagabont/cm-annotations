var _ = require('lodash'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    VideoAnnotation = require('../models/video-annotation');

module.exports = function(server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function(socket) {

        var getAnnotationsAsync = async(function(videoId) {
            return await (VideoAnnotation.find({
                video_id: videoId
            }).sort('start').exec());
        });

        socket.on('annotations:get', async(function(params) {
            var videoId = params.video_id;
            var annotations = await (getAnnotationsAsync(videoId));
            // return annotations only to requester
            socket.emit('annotations:updated', annotations);
        }));

        socket.on('annotations:save', async(function(params) {
            // find annotation model from DB
            var annotation = await (VideoAnnotation.findById(params.annotation._id).exec());

            // update annotation properties
            if (annotation) {
                var model = params.annotation;

                annotation.start = model.start;
                annotation.end = model.end;
                annotation.text = model.text;
                annotation.position = model.position;
                annotation.size = model.size;
                annotation.type = model.type;

                // save to DB
                await (annotation.save());
            } else {
                // create new model in DB
                annotation = await (VideoAnnotation.create(params.annotation));
            }

            var videoId = annotation.video_id;
            var annotations = await (getAnnotationsAsync(videoId));

            // notify all users about changes
            io.sockets.emit('annotations:updated', annotations);
        }));

        socket.on('annotations:delete', async(function(params) {
            try {
                var annotationId = params.id;

                // find annotation in db
                var annotation = await (VideoAnnotation.findById(annotationId).exec());
                if (!annotation) {
                    return;
                }

                var videoId = annotation.video_id;

                // remove annotation from db
                await (annotation.remove());
                var annotations = await (getAnnotationsAsync(videoId));

                // notify all users about changes
                io.sockets.emit('annotations:updated', annotations);
            } catch (e) {
                console.log(e);
            }
        }));

        socket.on('comments:post', async(function(params) {
            try {
                var annotationId = params.annotation_id;

                // find annotation in db
                var annotation = await (VideoAnnotation.findById(annotationId).exec());
                if (!annotation) {
                    return;
                }

                var comment = {
                    text: params.text,
                    author: socket.user || 'Guest'
                };

                annotation.comments.push(comment);

                // Save annotation
                await (annotation.save());

                // Notify users that the annotation
                // comments have been updated
                var eventName = annotationId + ':comments:updated';
                io.sockets.emit(eventName, annotation);
            } catch (e) {
                console.log(e);
            }
        }));

        socket.on('comments:remove', async(function(params) {
            try {
                var annotationId = params.annotation_id;
                var commentId = params.comment_id;

                var annotation = await (VideoAnnotation.findById(annotationId).exec());
                if (!annotation) {
                    return;
                }

                for (var i = 0; i < annotation.comments.length; i++) {
                    if (annotation.comments[i]._id.toString() === commentId) {
                        console.log('removing comment', commentId);
                        annotation.comments[i].remove();
                    }
                }

                // Save annotation
                await (annotation.save());

                var eventName = annotationId + ':comments:updated';
                io.sockets.emit(eventName, {
                    comments: annotation.comments
                });

            } catch (e) {
                console.log(e);
            }
        }));
    });
};
