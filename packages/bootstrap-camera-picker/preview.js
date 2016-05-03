let constraints = window.constraints = {
    audio: false,
    video: true
};

BootstrapCameraPicker = {
    getPicture(callback, args) {
        let view = Blaze.renderWithData(
            Template.BootstrapCameraPickerPreview,
            {callback, args},
            document.body);

        view._domrange.members[0].view.templateInstance().$('.modal').modal('show');
    }
};

Template.BootstrapCameraPickerPreview.helpers({
    hasPhoto() {
        return Template.instance().hasPhoto.get();
    }
});

Template.BootstrapCameraPickerPreview.events({
    'show.bs.modal'(e, t) {
        MeteorCamera.showPreview(t.$('.modal-body')[0]);
    },
    'click .BootstrapFileUploadPreview-cancel'(e, t) {
        e.preventDefault();
        if (t.hasPhoto.get()) {
            t.hasPhoto.set(false);
            MeteorCamera.showPreview(t.$('.modal-body')[0]);
        } else {
            MeteorCamera.hide();
            t.$('.modal').modal('hide');
            $('#BootstrapCameraPickerPreview').remove();
            if (_.isFunction(t.data.callback)) {
                t.data.callback.apply(t,[{code: 404, message: 'No photo taken'}, t.dataUrl.get()].concat(t.data.args || []));
            }
            t.dataUrl.set('');
        }
    },
    'click .BootstrapFileUploadPreview-take-photo'(e, t) {
        e.preventDefault();

        if (t.hasPhoto.get()) {
            t.hasPhoto.set(false);
            MeteorCamera.hide();
            t.$('.modal').modal('hide');
            $('#BootstrapCameraPickerPreview').remove();
            if (_.isFunction(t.data.callback)) {
                t.data.callback.apply(t,[null, t.dataUrl.get()].concat(t.data.args || []));
            }
            t.dataUrl.set('');
        } else {
            t.dataUrl.set(MeteorCamera.takeSnapshot());
            t.hasPhoto.set(true);
        }

    }
});

Template.BootstrapCameraPickerPreview.onCreated(function(){
    this.hasPhoto = new ReactiveVar(false);
    this.dataUrl = new ReactiveVar('');
});