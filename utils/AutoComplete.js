var pty = require('node-pty');

function AutoComplete() {
    ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 80,
        cwd: process.cwd(),
        env: process.env
    });   
}

AutoComplete.prototype.searchCommand = function(command, CALLBACK) {
    var commandQuery = "compgen -c " + command + "\r"; //get key input

    ptyProcess.on('data', function(data) {
        console.log("result:");
        data = data.split(/\r?\n/);
        data.shift();
        data.pop();

        console.log(data);
        if(data.length === 0) {
            CALLBACK(-1);
        }
        else {
            CALLBACK(data);
        }
    });
    ptyProcess.write(commandQuery);
};

module.exports = AutoComplete;
