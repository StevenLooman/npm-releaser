var async = require('async');
var package_ = require('./package');
var readline = require('readline');


function run(vcs) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // pre: ask new dev version
    // work: update version, diff and commit, push
    async.waterfall([
        function askNewVersion(callback) {
            function proxy(answer) {
                return callback(null, answer);
            }

            var currentVersion = package_.getVersion();
            var suggestedVersion = package_.suggestNewVersionDevelop();
            return rl.question('New version? [' + suggestedVersion + '] ', proxy);
        },
        function updateVersion(version, callback) {
            // if none was given, take the default
            version = version || package_.suggestNewVersionDevelop();
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

        if (err) {
            console.log('Caught error: ', err);
        }
    });

}


module.exports = exports = {
    'run': run
};
