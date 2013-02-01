var async = require('async');
var package_ = require('./package');
var readline = require('readline');

var npm = require('./npm');


function run(vcs) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // pre: get version, tag not already exists
    // work: make tag, release
    async.waterfall([
        function getTags(callback) {
            return vcs.getTags(callback);
        },
        function ensureTagNotExists(tags, callback) {
            var version = package_.getVersion();
            if (tags.indexOf(version) != -1) {
                return callback('Tag "' + version + '" already exists! Remove the tag or change the current version.');
            }
            return callback();
        },
        function makeTag(callback) {
            var version = package_.getVersion();
            console.log('Creating tag: "' + version + '"');
            return vcs.createTag(version, callback);
        },
        function release(callback) {
            console.log('Releasing to NPM');
            // npm.publish();

            return callback();
        }
    ],
    function finalize(err) {
        rl.close();

        if (err) {
            console.log('Caught error: ', err);
        }
    });

}


module.exports = exports = {
    'run': run
};
