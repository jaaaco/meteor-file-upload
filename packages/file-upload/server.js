Files = new Meteor.Collection('Files');

Meteor.publish("Files", function (selector) {
    if (this.userId) {
        return Files.find(selector);
    }
});

Files.allow({
    insert: function(userId){
        return userId;
    },
    update: function(userId){
        return userId;
    },
    remove: function(userId){
        // TODO: blokada usunięcia użytego gdziekolwiek towaru
        return userId;
    }
});

Router.map(function () {
    this.route('files', {
        where: 'server',
        path: '/files/:id',
        action: function () {
            var fh = fs.readFileSync(Meteor.settings.files.path + this.params.id);
            var file = Files.findOne({_id: this.params.id});

            if (!file) {
                return;
            }

            var headers = {
                'Content-type': file.type,
                'Content-Disposition': "attachment; filename=" + file.name
            };

            this.response.writeHead(200, headers);
            return this.response.end(fh);
        }
    });
    this.route('filesDisplay', {
        where: 'server',
        path: '/files/display/:id',
        action: function () {
            var fh = fs.readFileSync(Meteor.settings.files.path + this.params.id);
            var file = Files.findOne({_id: this.params.id});

            if (!file) {
                return;
            }

            var headers = {
                'Content-type': file.type,
                'Content-Length': file.size
            };

            this.response.writeHead(200, headers);
            return this.response.end(fh);
        }
    });
});

Fiber = Npm.require("fibers");
var fs = Npm.require('fs');

// Initiating file upload on client side
Files.find({status: 'new'}).observe({
    added: function(row) {
        _.delay(function(row){
            Fiber(function(row) {
                Files.update({_id: row._id},{$set: {
                    date: +(moment().toDate()),
                    upload: {
                        start: 0,
                        stop: row.size < 100000 ? row.size : 100000,
                        progress: 0
                    },
                    status: 'upload'
                }});
            }).run(row);
        },500,row);
    }
});

// removing actual file
Files.find({$or: [{status: 'completed'},{status: 'upload'}]}).observe({
    removed: function(row) {
        fs.unlink(Meteor.settings.files.path + row._id);
    }
});

// encoding dataUrl
Files.find({status: 'completed', saveDataUrl: true, dataUrl: null}).observe({
    added: function(row) {

        fs.readFile(Meteor.settings.files.path + (row.link ? row.link : row._id), function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            var dataUrl = 'data:image/jpeg;base64,';
            dataUrl += new Buffer(data).toString('base64');

            Fiber(function(dataUrl) {
                Files.update({_id: row._id},{$set: {
                    dataUrl: dataUrl
                }});
            }).run(dataUrl);

        });
    }
});

// TODO: obsługa porzuconych plików

// receiving file chunks and initiating further upload
Meteor.methods({
    'files.base64' (_id, data) {
        check(_id, String);
        check(data, String);


        if (!this.userId) {
            throw new Meteor.Error(505, 'Brak dostępu');
        }
        
        const buffer = new Buffer(data, 'base64');
        var file = Files.findOne({_id: _id});

        if (!file) {
            throw new Meteor.Error(404, 'Nie znaleziono pliku');
        }

        fs.appendFile(Meteor.settings.files.path +file._id, data.slice(22), 'base64', function(err) {
            if(err) {
                Fiber(function(_id) {
                    Files.update({_id: _id},{$set: {
                        status: 'error',
                        error: ''+err
                    },$unset:{
                        upload: ''
                    }});
                }).run(_id);
            } else {
                Fiber(function(_id) {
                    Files.update({_id: _id},{$set: {
                        size: buffer.length,
                        type: 'image/jpg',
                        status: 'completed',
                        date: +(moment().toDate())
                    },$unset:{
                        upload: ''
                    }});
                }).run(_id);
            }
        });
    },
    'files.upload': function(_id, data) {
        check(_id, String);
        check(data, String);

        if (!this.userId) {
            throw new Meteor.Error(505, 'Brak dostępu');
        }

        var buffer = new Buffer(data, 'binary');

        var file = Files.findOne({_id: _id});

        fs.appendFile(Meteor.settings.files.path +file._id, buffer, 'binary', function(err) {
            if(err) {
                Fiber(function(_id) {
                    Files.update({_id: _id},{$set: {
                        status: 'error',
                        error: ''+err
                    },$unset:{
                        upload: ''
                    }});
                }).run(_id);
            } else {
                Fiber(function(_id) {
                    var file = Files.findOne({_id: _id});

                    if (file.upload.stop == file.size) {
                        Files.update({_id: _id},{$set: {
                            status: 'completed'
                        },$unset:{
                            upload: ''
                        }});
                    } else {
                        Files.update({_id: _id},{$set: {
                            upload: {
                                start: file.upload.stop,
                                stop: (file.upload.stop + 100000) < file.size ? (file.upload.stop + 100000) : file.size,
                                progress: Math.floor(file.upload.stop / file.size * 100)
                            }
                        }});
                    }


                }).run(_id);
            }
        });
    }
});

// creating storage space
Meteor.startup(function(){
    try {
        fs.mkdir(Meteor.settings.files.path);
    } catch (e) {}
});
