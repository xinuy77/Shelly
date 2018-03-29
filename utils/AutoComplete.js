const {StringDecoder} = require('string_decoder');
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
    const decoder = new StringDecoder('utf8');
    var commandQuery = "compgen -c " + command + "\r"; //get key input

    ptyProcess.on('data', function(data) {

        //process.stdout.write(decoder.write(data));

        data = data.split(/\r?\n/);
        
        data.shift();
        data.pop();

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
