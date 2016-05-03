Package.describe({
    name: 'jaaaco:bootstrap-camera-picker',
    version: '0.0.5',
    // Brief, one-line summary of the package.
    summary: 'Meteor plugin to pick image from built-in camera',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jaaaco/meteor-file-upload/tree/master/packages/bootstrap-camera-picker',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use(['jaaaco:meteor-camera@0.0.5', 'ecmascript', "templating", "blaze", "less", "reactive-var"]);

    api.addFiles('preview.html','client');
    api.addFiles('preview.js','client');
    api.export('BootstrapCameraPicker');
});
