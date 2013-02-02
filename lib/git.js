var child_process = require('child_process');
var fs = require('fs');


GIT_DIR = '.git';


function vcsAvailable() {
    return fs.existsSync(GIT_DIR);
}


function getTags(callback) {
    function parseGitTag(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        var tags = stdout.split('\n');
        // filter empty lines
        tags = tags.filter(function(elem) { return elem; });
        return callback(null, tags);
    }

    var command = 'git tag -l';
    child_process.exec(command, parseGitTag);
}

function getLastTag(callback) {
    function parseTags(err, tags) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }
        if (!tags) {
            return callback(null);
        }

        return tags.pop();
    }

    getTags(parseTags);
}

function lastTagLog(callback) {

    var command = 'git log ...';
    getLastTag(callback);
}

function lastTagDiff() {

}


function diff(callback) {
    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        // show git diff
        console.log(stdout);

        return callback();
    }

    var command = 'git diff';
    child_process.exec(command, parseGitOutput);
}

function hasUncommittedChanges(callback) {
    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        // no output means no changes
        return callback(null, !stdout);
    }

    var command = 'git status --porcelain';
    child_process.exec(command, callback);
}

function commit(version, callback) {
    var message = '"Preparing release ' + version + '"';
    console.log('GIT: Commiting new version: ' + version + ', message: ' + message);

    var command = 'git commit -am ' + message;
    child_process.exec(command, callback);
}


function createTag(tag, callback) {
    function parseGitTagResult(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        return callback();
    }

    var command = 'git tag -a "' + tag + '" -m "Tagging version ' + tag + '"';
    child_process.exec(command, parseGitTagResult);
}

function pushTag(tag, repository, callback) {
    function parseGitPushTagResult(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        return callback();
    }

    repository = repository || 'origin';
    var command = 'git push ' + repository;

    child_process.exports(command, parseGitPushTagResult);
}



module.exports = exports = {
    'vcsAvailable': vcsAvailable,

    'getTags': getTags,
    'getLastTag': getLastTag,
    'lastTagLog': lastTagLog,
    'lastTagDiff': lastTagDiff,

    'diff': diff,
    'hasUncommittedChanges': hasUncommittedChanges,
    'commit': commit,

    'createTag': createTag,
    'pushTag': pushTag
};
