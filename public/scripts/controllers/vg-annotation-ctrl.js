app.controller('AnnotationCtrl', ['annotations',
    function(annotations) {
        this.config = {
            sources: [{
                src: 'https://www.youtube.com/watch?v=dF_ObGgzGE8'
            }],
            annotations: annotations.data
        };
    }
]);
