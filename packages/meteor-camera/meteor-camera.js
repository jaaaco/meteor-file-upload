let constraints = window.constraints = {
    audio: false,
    video: true,
    mandatory: {
        minWidth: 1280,
        minHeight: 720
    }
};

MeteorCamera = {
    view: null,
    stream: null,
    showPreview(element, callback, args = []) {
        if (!MeteorCamera.view) {
            MeteorCamera.view = Blaze.render(Template.MeteorCamera, element || document.body);
        }

        MeteorCamera.view.templateInstance().$('video').show();
        MeteorCamera.view.templateInstance().$('canvas').hide();

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                var videoTracks = stream.getVideoTracks();
                console.log('Got stream with constraints:', constraints);
                console.log('Using video device: ' + videoTracks[0].label);
                stream.onended = function() {
                    console.log('Stream ended');
                    MeteorCamera.stream = null;
                };

                MeteorCamera.stream = window.stream = stream; // make variable available to browser console
                MeteorCamera.view.templateInstance().$('video')[0].srcObject = stream;

                if (_.isFunction(callback)) {
                    callback.apply(stream, [null].concat(args || []));
                }
            })
            .catch(function(error) {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    console.log('The resolution ' + constraints.video.width.exact + 'x' +
                        constraints.video.width.exact + ' px is not supported by your device.');
                } else if (error.name === 'PermissionDeniedError') {
                    console.log('Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.');
                }
                console.log('getUserMedia error: ' + error.name, error);

                if (_.isFunction(callback)) {
                    callback.apply(stream, [error].concat(args || []));
                }
            });
    },
    hidePreview() {
        try {
            MeteorCamera.stream.getTracks()[0].stop();
        } catch (e) {}
        MeteorCamera.view.templateInstance().$('video').hide();
    },
    takeSnapshot() {
        const $canvas = MeteorCamera.view.templateInstance().$('canvas');
        const canvas = $canvas[0];
        const video = MeteorCamera.view.templateInstance().$('video')[0];

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        MeteorCamera.hidePreview();
        $canvas.show();
        return canvas.toDataURL('image/jpeg', 1);
    },
    hide() {
        MeteorCamera.view.templateInstance().$('canvas').hide();
        MeteorCamera.hidePreview();
    }
};

Template.MeteorCamera.onDestroyed(function(){
    if (MeteorCamera.stream && MeteorCamera.stream.getTracks()[0]) {
        MeteorCamera.stream.getTracks()[0].stop();
    }
    MeteorCamera.view = null;
    MeteorCamera.stream = null;
});