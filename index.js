const { spawn }  = require('child_process');
var pty          = require('node-pty');
var AutoComplete = require('./utils/AutoComplete.js');
var Shell        = require('./utils/Shell.js');              

window.$ = window.jQuery = require('jquery');

var shell        = new Shell();
var autoComplete = new AutoComplete();

$(document).ready(function() {
    $('.prompt').html('>');
    var terminal = new Terminal('#input-line .cmdline', '#container output', shell);
    terminal.init();
});
