Package.describe({
    name: 'jaaaco:bootstrap-camera-picker',
    version: '0.0.2',
    // Brief, one-line summary of the package.
    summary: 'Meteor plugin to pick image from built-in camera',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use(['ecmascript', "templating", "blaze", "less", "reactive-var"]);
    api.use('jaaaco:meteor-camera@0.0.1', 'client');
    api.addFiles('preview.html','client');
    api.addFiles('preview.js','client');
    api.export('BootstrapCameraPicker');
});
