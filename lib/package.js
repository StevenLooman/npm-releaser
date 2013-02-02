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
    // Semantic versioning: http://semver.org/
    var re = new RegExp(/(\d+)\.(\d+)\.(\d+)-?(\S+)?/);
    var m = version.match(re);
    if (!m) {
        return null;
    }

    return {
        major: parseInt(m[1], 10),
        minor: parseInt(m[2], 10),
        patch: parseInt(m[3], 10),
        extra: m[4] || null
    };
}

function purifyVersion() {
    var version = getVersion();
    var parsedVersion = parseVersion(version);

    if (!parsedVersion) {
        return null;
    }

    return parsedVersion.major + '.' + parsedVersion.minor + '.' + parsedVersion.patch;
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

    'purifyVersion': purifyVersion,
    'suggestNewVersion': suggestNewVersion,
    'suggestNewVersionDevelop': suggestNewVersionDevelop
};
