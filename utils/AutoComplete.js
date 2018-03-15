const { spawn } = require('child_process');
window.$        = window.jQuery = require('jquery');

//var   commands = ["Sad", "Happy", "Mad"]; // just a random array for the commands that we'll be implementing and using as the
                                           // database for now 
    
//this'll catch if the user presses a key so it'll parse the input and see if it can be auto-completed through our command array
//document.getElementByID('xterm-helper-textarea').addEventListener("onkeypress", functionName);

function AutoComplete() {
    
}

AutoComplete.prototype.searchCommand = function (cmd) {
    var compgen = spawn('compgen', ['-c']);
    var grep    = spawn('grep', ['mk']);
    
    compgen.stdout.on('data', function(data){
        grep.stdin.write(data);
    });

    grep.stdout.on('data', function(data){
        console.log(data.toString());
    });
};
module.exports = AutoComplete;
