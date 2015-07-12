var _ = require('lodash'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    VideoAnnotation = require('../models/video-annotation');

module.exports = function (server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {

        var getAnnotationsAsync = async(function (videoId) {
            return await(VideoAnnotation.find({video_id: videoId}).sort('start').exec());
        });

        socket.on('annotations:get', async(function (params) {
            var videoId = params.video_id;
            var annotations = await(getAnnotationsAsync(videoId));
            // return annotations only to requester
            socket.emit('annotations:updated', annotations);
        }));

        socket.on('annotations:save', async(function (params) {
            var annotation = await(VideoAnnotation.findById(params.annotation._id).exec());
            if (annotation) {
                annotation.start = params.annotation.start;
                annotation.end = params.annotation.end;
                annotation.text = params.annotation.text;
                await(annotation.save());
            }
            else {
                annotation = await(VideoAnnotation.create(params.annotation));
            }
            var videoId = annotation.video_id;
            var annotations = await(getAnnotationsAsync(videoId));

            // notify all users about changes
            io.sockets.emit('annotations:updated', annotations);
        }));

        socket.on('annotations:delete', async(function (params) {
            try {
                var annotationId = params.id;

                // find annotation in db
                var annotation = await(VideoAnnotation.findById(annotationId).exec());
                if (!annotation) {
                    return;
                }
                
                var videoId = annotation.video_id;

                // remove annotation from db
                await(annotation.remove());
                var annotations = await(getAnnotationsAsync(videoId));

                // notify all users about changes
                io.sockets.emit('annotations:updated', annotations);
            } catch (e) {
                console.log(e);
            }
        }));
    });
};
