Meteor plugin to pick image from built-in camera
================================================
## Installation for Meteor

```shell
meteor add jaaaco:bootstrap-camera-picker
```

## Basic usage

```javascript
BootstrapCameraPicker.getPicture(function(err, result, arg1, arg2, arg3){
    console.log(err, result.length, arg1, arg2, arg3);
},['example callback argument 1',2,3]);
```