Package.describe({
    name: 'jaaaco:meteor-camera',
    version: '0.0.5',
    // Brief, one-line summary of the package.
    summary: 'Basic WebRTC camera shots',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jaaaco/meteor-file-upload',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use(['ecmascript', "templating", "blaze", "less"]);

    api.addFiles([
        '.npm/package/node_modules/webrtc-adapter/out/adapter.js',
        'meteor-camera.html',
        'meteor-camera.js',
        'meteor-camera.less'
    ], 'client');

    api.export('MeteorCamera');
});

Npm.depends({
    "webrtc-adapter": "1.1.0"
});
