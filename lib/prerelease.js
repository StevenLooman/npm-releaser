var async = require('async');
var fs = require('fs');
var readline = require('readline');
var package_ = require('./package');


README_FILE = 'README.md';


function run(vcs, end) {
    console.log('INFO: Starting prerelease.');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var currentVersion = package_.getVersion();

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

            console.log('INFO: Current version is: "' + currentVersion + '"');
            var pureVersion = package_.purifiedVersion(); // strip off '-dev0'
            return rl.question('New version? [' + pureVersion + '] ', proxy);
        },
        function updateVersion(version, callback) {
            // if none was given, take the default
            version = version || package_.purifiedVersion();
            version = version.trim();
            package_.setVersion(version);

            console.log('INFO: Set package.json\'s version to: "' + version + '"');
            console.log('INFO: Changed version from "' + currentVersion + '" to "' + version + '"');

            return callback();
        },
        function showChanges(callback) {
            return vcs.diff(callback);
        },
        function okToCommit(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            return rl.question('OK to commit this? (Y/n) ', proxy);
        },
        function commit(answer, callback) {
            answer = answer.toLowerCase() || 'y';
            answer = answer.trim();
            if (answer == 'y') {
                var version = package_.getVersion();
                var message = 'Preparing release: ' + version;
                return vcs.commit(message, callback);
            }

            return callback();
        },
        function showLastCommit(r, callback) {
            return vcs.lastCommitLogEntry(callback);
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
