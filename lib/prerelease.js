var async = require('async');
var fs = require('fs');
var readline = require('readline');
var package_ = require('./package');


README_FILE = 'README.md';


function run(vcs, end) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // pre: no uncommitted changes
    // work: write version, commit
    async.waterfall([
        function ensureNoUncommitedChanges(callback) {
            function checkUncommittedChanges(err, hasChanges) {
                if (err) { return callback(err); }

                if (hasChanges) {
                    return callback('Repository has uncommitted changes!');
                }

                return callback();
            }

            vcs.hasUncommittedChanges(checkUncommittedChanges);
        },
        function askNewVersion(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            var currentVersion = package_.getVersion();
            var pureVersion = package_.purifyVersion(); // strip off '-dev0'
            return rl.question('New version? [' + pureVersion + '] ', proxy);
        },
        function updateVersion(version, callback) {
            // if none was given, take the default
            version = version || package_.purifyVersion();
            package_.setVersion(version);

            return callback();
        },
        function showChanges(callback) {
            return vcs.diff(callback);
        },
        function commit(callback) {
            var version = package_.getVersion();
            return vcs.commit(version, callback);
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
