Package.describe({
    name: 'jaaaco:file-upload',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'File upload control with gallery',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jaaaco/meteor-file-upload',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    api.use('blaze-html-templates', 'client');
    api.use('ecmascript');
    api.use('jaaaco:template-logic@0.0.2', 'client');
    api.use('wfirma:dot@0.0.2');
    api.use('iron:router@1.0.12');
    api.use('jaaaco:bootstrap-camera-picker@0.0.2', 'client');

    api.export('Files',['server','client']);

    api.addFiles('Files.html', 'client');
    api.addFiles('Files.js', 'client');

    api.addFiles('FilesGallery.html', 'client');
    api.addFiles('FilesGallery.js', 'client');

    api.addFiles('server.js', 'server');
});
