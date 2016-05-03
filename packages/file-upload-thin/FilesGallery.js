Template.FilesGallery.helpers({
    files: function() {
        var selector = {};
        selector[this.collection + '._id'] = this._id;
        selector['status'] = 'completed';
        return Files.find(selector, {sort: {name: 1}});
    }
});

Template.FilesGallery.onCreated(function(){
    this.autorun(() => {
        let selector = {status: 'completed'};
        if (this.data.collection && this.data._id) {
            selector[this.data.collection + '._id'] = this.data._id;
        }
        this.subscribe('Files',selector);
    });
});
