var pty = require('node-pty');
var commandList = [];
var sentCommand = false;

function AutoComplete() {
    ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 80,
        cwd: process.cwd(),
        env: process.env
    }); 
}

function getCommand(command, CALLBACK) {
    var commandQuery = "compgen -c " + command + "\r"; //get key input

    ptyProcess.on('data', function(data) {
        data = data.split(/\r?\n/);

        data.shift();
        console.log(data);
        data.pop();

        console.log(data);
        if(data.length != 0) {
            if(data.length === 0) {
                CALLBACK([]);
            }
            else {
                CALLBACK(data);
                sentCommand = true;
            }
        }
    });

    ptyProcess.write(commandQuery);
};

AutoComplete.prototype.fillDropDown = function(command, input) {
    commandList = [];
    getCommand(command, (data)=>{
        commandList = commandList.concat(data); 
        $(".cmdline").autocomplete({source: data});
    });   
};

module.exports = AutoComplete;
