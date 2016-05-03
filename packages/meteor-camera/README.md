Basic WebRTC camera shots
==========================
## Installation for Meteor

```shell
meteor add jaaaco:meteor-camera
```

## Basic usage

```javascript
MeteorCamera.showPreview(document.body); // show camera preview in selected DOM Element

let imageDataUrl = MeteorCamera.takeSnapshot(); // get image data url (ready to use in img src)

MeteorCamera.hide(); // hide everything and release camera

```