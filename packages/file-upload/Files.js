Files = new Meteor.Collection('Files');

Template.Files.helpers({
    files() {
        return Files.find({[this.collection + '._id']: this._id}, {sort: {name: 1}});
    },
    getIcon() {
        return 'fa-file-text';
    },
    getDictionaryUuid() {
        return Template.parentData().collection + 'FileCategory';
    },
    isImage () {
        return _.contains(['image/png','image/jpg','image/jpeg'],this.type);
    },
    getFileSize (arg, descriptor) {
        if (!arg) return;
        /**
         * SI suffixes
         * @type {Object}
         */
        var si = {
            bits: ['B', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
            bytes: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        };

        var bit = /b$/,
            radix = 10,
            left = /.*\./,
            zero = /^0$/;

        var result = '',
            skip = false,
            e, base, bits, ceil, neg, num, round, unix, spacer, suffix, z, suffixes;

        if (isNaN(arg)) {
            throw new Error('Invalid arguments');
        }

        descriptor = descriptor || {};
        bits = (descriptor.bits === true);
        unix = (descriptor.unix === true);
        base = descriptor.base !== undefined ? descriptor.base : unix ? 2 : 10;
        round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
        spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? '' : ' ';
        suffixes = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
        num = Number(arg);
        neg = (num < 0);
        ceil = base > 2 ? 1000 : 1024;

        // Flipping a negative number to determine the size
        if (neg) {
            num = -num;
        }

        // Zero is now a special case because bytes divide by 1
        if (num === 0) {
            if (unix) {
                result = '0';
            } else {
                suffix = 'B';
                result = '0' + spacer + (suffixes[suffix] || suffix);
            }
        } else {
            e = Math.floor(Math.log(num) / Math.log(1000));

            // Exceeding supported length, time to reduce & multiply
            if (e > 8) {
                result = result * (1000 * (e - 8));
                e = 8;
            }

            if (base === 2) {
                result = num / Math.pow(2, (e * 10));
            } else {
                result = num / Math.pow(1000, e);
            }

            if (bits) {
                result = (result * 8);

                if (result > ceil) {
                    result = result / ceil;
                    e++;
                }
            }

            result = result.toFixed(e > 0 ? round : 0);
            suffix = si[bits ? 'bits' : 'bytes'][e];

            if (!skip && unix) {
                if (bits && bit.test(suffix)) {
                    suffix = suffix.toLowerCase();
                }

                suffix = suffix.charAt(0);
                z = result.replace(left, '');

                if (suffix === 'B') {
                    suffix = '';
                } else if (!bits && suffix === 'k') {
                    suffix = 'K';
                }

                if (zero.test(z)) {
                    result = parseInt(result, radix);
                }

                result += spacer + ( suffixes[suffix] || suffix );
            } else if (!unix) {
                result += spacer + ( suffixes[suffix] || suffix );
            }
        }

        // Decorating a 'diff'
        if (neg) {
            result = '-' + result;
        }

        return result;
    }
});

var newFiles = {},
    templateData;

Template.Files.events({
    'click .files-get-picture' (e, t) {
        e.preventDefault();
        BootstrapCameraPicker.getPicture(function(err, result, templateData){
            if (!err) {
                const fileId = Files.insert({
                    name: 'Zdjęcie',
                    lastModified: +(new Date()),
                    status: 'base64',
                    users: {_id: Meteor.userId()},
                    [templateData.collection]: {_id: templateData._id}
                });
                Meteor.call('files.base64', fileId, result);
            }
        },t.data);
    },

    'dragover div.well' (e, t) {
        e.preventDefault();
        $(e.currentTarget).addClass('dragover');
    },

    'dragleave div.well' (e, t) {
        $(e.currentTarget).removeClass('dragover');
    },

    'drop div.well' (e, t) {
        $(e.currentTarget).removeClass('dragover');
        e.preventDefault();
        let files = e.originalEvent.dataTransfer.files;

        var me = this;

        _.each(files, file => {
            var data = {};
            data[me.collection] = {_id: me._id};

            if (me.saveDataUrl) {
                data['saveDataUrl'] = true;
            }

            var fileId = Files.insert(_.extend({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: +(file.lastModifiedDate),
                status: 'new',
                users: {_id: Meteor.userId()}
            },data));

            newFiles[fileId] = file;
        });
    }
});


Template.Files.onCreated(function(){
    this.autorun(() => {
        let selector = {};
        if (this.data.collection && this.data._id) {
            selector[this.data.collection + '._id'] = this.data._id;
        }
        this.subscribe('Files',selector);
    });
});


Meteor.startup(() => {
    function processUpload(row) {
        var reader = new FileReader();
        var blob = newFiles[row._id].slice(row.upload.start, row.upload.stop);

        reader.onloadend = e => {
            if (e.target.readyState == FileReader.DONE) {
                Meteor.call('files.upload', row._id, e.target.result);
            }
        };

        reader.onerror = e => {
            console.log('error', e);
        };


        reader.onabort = e => {
            console.log('abort', e);
        };

        reader.readAsBinaryString(blob);
    }

    Files.find({status: 'upload'}).observe({
        added (row) {
            if (newFiles[row._id]) {
                processUpload(row);
            }
        }
    });

    Files.find({status: 'upload'}).observeChanges({
        changed (_id, fields) {
            if (fields.upload && fields.upload.stop) {
                var row = Files.findOne({_id: _id});
                processUpload(row);
            }
        }
    });
});