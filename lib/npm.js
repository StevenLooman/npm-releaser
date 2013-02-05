var child_process = require('child_process');


function publish(callback) {
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
    'publish': publish
};
