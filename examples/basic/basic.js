if (Meteor.isClient) {
    Template.hello.events({
        'click button': function (e, t) {
            BootstrapCameraPicker.getPicture(function (err, result, arg1, arg2, arg3) {
                console.log(err, result.length, arg1, arg2, arg3);
            }, ['example callback argument 1', 2, 3]);
        }
    });
}
