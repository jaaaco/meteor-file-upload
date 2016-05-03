Package.describe({
    name: 'jaaaco:meteor-camera',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Basic WebRTC camera shots',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: null
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use(['ecmascript', "templating", "blaze", "less"]);
    api.addFiles('.npm/package/node_modules/webrtc-adapter/out/adapter.js', 'client');

    api.addFiles('meteor-camera.html', 'client');
    api.addFiles('meteor-camera.js', 'client');
    api.addFiles('meteor-camera.less', 'client');
    api.export('MeteorCamera');
});

Npm.depends({
    "webrtc-adapter": "1.1.0"
});
