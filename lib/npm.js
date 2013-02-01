var child_process = require('child_process');


function release(callback) {
    function parseNpmPublish(err, stdout, stderr) {
        if (err) {
            return callback(err);
        }

        console.log(stdout);

        return callback();
    }

    var command = 'npm publish';
    child_process.exec(command, parseNpmPublish);
}


module.exports = exports = {
    'release': release
};
