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

            // update annotation model
            if (annotation) {
                var model = params.annotation;
                annotation.start = model.start;
                annotation.end = model.end;
                annotation.text = model.text;
                annotation.position = model.position;
                annotation.size = model.size;
                annotation.is_inline = model.is_inline;
                
                // save to DB
                await (annotation.save());
            }
            // create new model in DB
            else {
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
    });
};
