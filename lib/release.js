var async = require('async');
var package_ = require('./package');
var readline = require('readline');

var npm = require('./npm');


function run(vcs, end) {
    console.log('INFO: Starting release.');

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
        function okToMakeTag(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            var version = package_.getVersion();
            return rl.question('OK to make tag "' + version + '"? (Y/n) ', proxy);
        },
        function makeTag(answer, callback) {
            answer = answer.toLowerCase() || 'y';
            answer = answer.trim();
            if (answer == 'y') {
                var version = package_.getVersion();
                console.log('Creating tag: "' + version + '"');
                return vcs.createTag(version, callback);
            }

            return callback();
        },
        function okToRelease(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            return rl.question('OK to release to NPM? (Y/n) ', proxy);
        },
        function release(answer, callback) {
            answer = answer.toLowerCase() || 'y';
            answer = answer.trim();
            if (answer == 'y') {
                console.log('INFO: Publishing to NPM');
                // npm.publish();

                return callback();
            }


            return callback();
        }
    ],
    function finalize(err) {
        rl.close();

        end(err);
    });
}


module.exports = exports = {
    'run': run
};
