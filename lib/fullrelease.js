var async = require('async');
var prerelease = require('./prerelease');
var release = require('./release');
var postrelease = require('./postrelease');

function run(vcs, end) {
    async.waterfall([
        function doPreRelease(callback) {
            prerelease.run(vcs, callback);
        },
        function doRelease(callback) {
            release.run(vcs, callback);
        },
        function doPostRelease(callback) {
            postrelease.run(vcs, callback);
        }
    ], function finalize(err) {
        end(err);
    });
}


module.exports = exports = {
    'run': run
};
