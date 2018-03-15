const { spawn }          = require('child_process');
var pty                  = require('node-pty');
var Terminal             = require('xterm').Terminal;
var fit                  = require('./node_modules/xterm/dist/addons/fit/fit.js');
var AutoComplete         = require('./utils/AutoComplete.js');
window.$ = window.jQuery = require('jquery');

Terminal.applyAddon(fit);

const shell = new Terminal();

$(document).ready(function() {
    var ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 80,
        cwd: process.cwd(),
        env: process.env
    });
    var autoComplete = new AutoComplete();

    shell.open($('#shell')[0]);
    shell.fit();

    setResizeEvent();
    setStreamPipeEvent(ptyProcess);  
});

function setStreamPipeEvent(ptyProcess) {
    shell.on('data', function(data){
        ptyProcess.write(data);
    });

    ptyProcess.on('data', function(data) {
        shell.write(data);
    });
};

function setResizeEvent() {
    window.addEventListener('resize', function(e){
        shell.fit();
    });
};
