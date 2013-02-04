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

    var command = 'git log ...';
    getLastTag(callback);
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

function lastCommitLogEntry(callback) {
    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        console.log(stdout);

        return callback();
    }

    var command = 'git log HEAD^..HEAD';
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

function commit(message, callback) {
    console.log('GIT: Commiting, message: "' + message + '"');

    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        // no output means no changes
        return callback(null, !stdout);
    }


    var command = 'git commit -am "' + message + '"';
    child_process.exec(command, parseGitOutput);
}


function createTag(tag, callback) {
    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        return callback();
    }

    var command = 'git tag -a "' + tag + '" -m "Tagging version ' + tag + '"';
    child_process.exec(command, parseGitOutput);
}

function pushTag(tag, repository, callback) {
    function parseGitOutput(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            return callback(err);
        }

        return callback();
    }

    repository = repository || 'origin';
    var command = 'git push ' + repository;

    child_process.exec(command, parseGitOutput);
}


module.exports = exports = {
    'vcsAvailable': vcsAvailable,

    'getTags': getTags,
    'getLastTag': getLastTag,
    'lastTagLog': lastTagLog,
    'lastTagDiff': lastTagDiff,
    'lastCommitLogEntry': lastCommitLogEntry,

    'diff': diff,
    'hasUncommittedChanges': hasUncommittedChanges,
    'commit': commit,

    'createTag': createTag,
    'pushTag': pushTag
};
