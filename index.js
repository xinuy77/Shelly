const { spawn }          = require('child_process');
var pty                  = require('node-pty');
var AutoComplete         = require('./utils/AutoComplete.js');
window.$ = window.jQuery = require('jquery');

var Shell = require('./utils/Shell.js');              
var   shell        = new Shell();
var   autoComplete = new AutoComplete();
var   ptyProcess;

$(document).ready(function() {
    $('.prompt').html('>');
    //setResizeEvent();
    setBasicKeyEvent();
    //setAutoCompleteEvent();
});

function setBasicKeyEvent() {
    var cmdLine = $('.cmdline')[0];

    cmdLine.addEventListener('keydown', processNewCommand, false);
}

function processNewCommand(e) {
    var command;
    if(e.keyCode == 13) {
        command = this.value + "\r";
        console.log("command sent" + command);
        write(command);
    }
};

function setAutoCompleteEvent() {
    $('.xterm-helper-textarea').on('change keyup paste', function() {
        var command = $('.xterm-helper-textarea').val();
       // autoComplete.listCommand();
        //
        $('.xterm-helper-textarea').textcomplete([{
            words: ['apple', 'google', 'facebook', 'github'],
            match: /\b(\w{2,})$/,
            search: function (term, callback) {
                callback($.map(this.words, function (word) {
                    return word.indexOf(term) === 0 ? word : null;
                }));
            },
            index: 1,
            replace: function (word) {
                return word + ' ';
            }
        }]);
        $('#textcomplete-dropdown-1').insertAfter('.xterm-helper-textarea');
        //
    });
};

function setResizeEvent() {
    window.addEventListener('resize', function(e){
        shell.fit();
    });
};

function write(command) {
    var arg = command.split(' ');
    console.log(process.env.PATH);
    if(arg[0] === 'exit') {
      //  return rl.close();   
    } 
    else if(arg[0] === 'cd') {
        process.chdir(arg[1]);
    }
    else {
        var arg_testArr = ["ls"];
        var arg_1 = arg[0]; //extra space  
        // https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
        console.log("This is arg:");
        console.log(typeof arg_1);
        console.log(arg_1);
        console.log(arg_1.length);
        var arg_test = arg_testArr[0];
        console.log(typeof arg_test);
        console.log(arg_test);
        console.log(arg_test.length);

        if(arg_test === arg_1) {
          console.log("There equal!");
        }
        else {
          console.log("Not equal!");
        }
        var child = spawn(arg_test, []);

        child.stdout.on('data', function(data) {
            console.log(data.toString());
        });
        child.on('exit', function(e, code) {
        });

        child.on('error', function(err) {
            console.log("Command not found...");
            console.log(err);
            console.log(command);
        });
    }
/*
    var shell = spawn('ls', []);

    shell.stdout.on('data', function(data){
        console.log(data.toString());
    });*/
};

