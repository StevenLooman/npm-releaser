var async = require('async');
var package_ = require('./package');
var readline = require('readline');


function run(vcs, end) {
    console.log('INFO: Starting postrelease.');

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    var currentVersion = package_.getVersion();

    // pre: ask new dev version
    // work: update version, diff and commit, push
    async.waterfall([
        function askNewVersion(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            var suggestedVersion = package_.suggestNewVersionDevelop();
            console.log('INFO: Current version is: "' + currentVersion + '"');
            return rl.question('Enter new development version: [' + suggestedVersion + '] ', proxy);
        },
        function updateVersion(version, callback) {
            // if none was given, take the default
            version = version || package_.suggestNewVersionDevelop();
            console.log('INFO: New version is: "' + version + '"');

            package_.setVersion(version);

            var updatedVersion = package_.getVersion();
            console.log('INFO: Set package.json version to: "' + updatedVersion + '"');

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
                var message = 'Back to development: ' + version;
                return vcs.commit(message, callback);
            }

            return callback();
        },
        function showLastCommit(r, callback) {
            return vcs.lastCommitLogEntry(callback);
        },
        function okToPushTag(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            return rl.question('OK to push the new tag to remote? (Y/n) ', proxy);
        },
        function pushTag(answer, callback) {
            answer = answer.toLowerCase() || 'y';
            answer = answer.trim();
            if (answer == 'y') {
                return vcs.pushTag(currentVersion, null, callback);
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
