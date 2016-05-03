File upload with progres bar 
================================================================
## Installation for Meteor

```shell
meteor add jaaaco:file-upload
```

If other apps are using same database make sure only one uses this package and others are using jaaaco:file-upload-thin instead.

Meteor.settings.files.path (default /tmp/files/) tells where files will be saved. 

## Basic usage

```html
{{>Files collection='Clients' _id=_id saveDataUrl=true}}
```

## Gallery mode

```html
{{>FilesGallery collection='Clients' _id=_id}}
```

where:

* collection - collection name, document is saved with Clients._id = _id (foreign key)
* _id - current document _id
* saveDataUrl (optional) - saves contents under dataUrl field, can be used as src parameter for <img>

