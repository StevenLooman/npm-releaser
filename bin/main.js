#!/usr/bin/env node


var npmReleaser = require('../');


KNOWN_COMMANDS = [ 'prerelease', 'release', 'postrelease', 'fullrelease' ];

VCS_MODULES = {
    'git': npmReleaser['git']
};


// ensure a git/svn/... is available
var vcs = findVcs();

// parse command
var command = parseCommand();

// execute command
command.run(vcs, reportError);


// helpers
function reportError(err) {
    if (err) {
        console.error('Caught error: ', err);
    }
}

function printHelp() {
    console.log('npm-releaser <command>');
    console.log('available commands: ' + KNOWN_COMMANDS);
}

function printNeedVcs() {
    console.log('No version control system (git, ...) detected!');
}

function findVcs() {
    var key;
    for (key in VCS_MODULES) {
        vcs = VCS_MODULES[key];
        if (vcs.vcsAvailable()) {
            return vcs;
        }
    }

    printNeedVcs();
    process.exit(-1);
}

function parseCommand() {
    command = process.argv[2];
    if (!command ||
        KNOWN_COMMANDS.indexOf(process) != -1) {
        printHelp();
        process.exit(-1);
    }

    return npmReleaser[command];
}
