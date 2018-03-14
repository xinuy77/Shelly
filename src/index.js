const { spawn } = require('child_process');
var pty         = require('node-pty');
var Terminal    = require('xterm').Terminal;
//import * as fit from 'xterm/lib/addons/fit/fit';

//Terminal.applyAddon(fit);

const shell =  new Terminal();

shell.open(document.getElementById('shell'));

//shell.fit();

var ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env
});

shell.on('data', function(data){
    ptyProcess.write(data);
    console.log(data);
});
 
ptyProcess.on('data', function(data) {
    shell.write(data);
});
