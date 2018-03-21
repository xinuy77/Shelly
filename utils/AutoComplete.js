const { spawn } = require('child_process');
window.$        = window.jQuery = require('jquery');
var pty         = require('node-pty');
require('./jquery.textcomplete.js');

var ptyProcess;

//var   commands = ["Sad", "Happy", "Mad"]; // just a random array for the commands that we'll be implementing and using as the
                                           // database for now 
    
//this'll catch if the user presses a key so it'll parse the input and see if it can be auto-completed through our command array
//document.getElementByID('xterm-helper-textarea').addEventListener("onkeypress", functionName);

function AutoComplete() {
    ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 80,
        cwd: process.cwd(),
        env: process.env
    });   
}

function searchCommand(command, CALLBACK) {
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

AutoComplete.prototype.listCommand = function () {
    var command = $('.xterm-helper-textarea').val();

    searchCommand(command, function(data) {
       // if(data != -1) {
        //}
    });

};
module.exports = AutoComplete;
