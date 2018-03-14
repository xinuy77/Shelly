const { spawn } = require('child_process');
var pty         = require('node-pty');
var Terminal    = require('xterm').Terminal;
var commands    = ["Sad", "Happy", "Mad"];

const shell =  new Terminal();

shell.open(document.getElementById('shell'));

document.getElementByID('xterm-helper-textarea').addEventListener("onkeypress", functionName);

var ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env
});

shell.on('data', function(data){
    ptyProcess.write(data);
});

ptyProcess.on('data', function(data) {
    shell.write(data);
});
    
