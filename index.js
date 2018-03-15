const { spawn }          = require('child_process');
var pty                  = require('node-pty');
var Terminal             = require('xterm').Terminal;
var fit                  = require('./node_modules/xterm/dist/addons/fit/fit.js');
window.$ = window.jQuery = require('jquery');

Terminal.applyAddon(fit);

const shell    = new Terminal();
var   commands = ["Sad", "Happy", "Mad"]; // just a random array for the commands that we'll be implementing and using as the
                                           // database for now 

shell.open($('#shell')[0]);

shell.fit();

//this'll catch if the user presses a key so it'll parse the input and see if it can be auto-completed through our command array
//document.getElementByID('xterm-helper-textarea').addEventListener("onkeypress", functionName);

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
   
window.addEventListener('resize', function(e){
    shell.fit();
});

