var fs = require('fs');


PACKAGE_FILE = process.cwd() + '/package.json';


function packageExists() {
    return fs.existsSync(PACKAGE_FILE);
}

function getVersion() {
    var package_ = require(PACKAGE_FILE);
    return package_['version'];
}

function setVersion(version) {
    var package_ = require(PACKAGE_FILE);
    package_['version'] = version;
    var json = JSON.stringify(package_);
    fs.writeFileSync(PACKAGE_FILE, json);
}

function parseVersion(version) {
    // XXX: TODO: allow for parsing of x.y.z-dev?
    // perhaps use package 'semver'?

    var re = new RegExp(/\d+\.\d+\.\d+(-dev\d)?/);
    if (!re.test(version)) {
        return null;
    }

    var v = version.split('.');

    return {
        major: parseInt(v[0], 10),
        minor: parseInt(v[1], 10),
        patch: parseInt(v[2], 10),
        extra: null
    };
}

function suggestNewVersion() {
    var version = getVersion();
    var parsedVersion = parseVersion(version);

    if (!parsedVersion) {
        return null;
    }

    return parsedVersion.major + '.' + parsedVersion.minor + '.' + (parsedVersion.patch + 1);
}

function suggestNewVersionDevelop() {
    var newVersion = suggestNewVersion();
    if (!newVersion) {
        return null;
    }

    return newVersion + '-dev0';
}


module.exports = exports = {
    'packageExists': packageExists,
    'getVersion': getVersion,
    'setVersion': setVersion,

    'suggestNewVersion': suggestNewVersion,
    'suggestNewVersionDevelop': suggestNewVersionDevelop
};
