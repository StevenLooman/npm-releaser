#!/usr/bin/env node


KNOWN_COMMANDS = [ 'prerelease', 'release', 'postrelease' ];

VCS_MODULES = {
    'git': require('./lib/git')
};


// ensure a git/svn/... is available
var vcs = findVcs();

// parse command
var command = parseCommand();

// execute command
command.run(vcs);


function printHelp() {
    console.log('npm-releaser help');
}

function printNeedVcs() {
    console.log('No version control system (git, svn, ...) detected!');
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

    return require('./lib/' + command);
}
