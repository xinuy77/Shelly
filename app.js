const { spawn } = require('child_process');

var readline = require('readline');
var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var startShell = function () {
  rl.question('Command: ', function (command) {
    if (command == 'exit') {
      return rl.close();   //closing RL and returning from function.
    } 
    //chdir test, cd not complete yet	  
    else if (command == 'cd') {
      process.chdir('/');
      startShell(); //Calling this function again to ask new question
    }
    else {
      var child = spawn(command, [], { 
        stdio: 'inherit'
      });
      child.on('exit', function (e, code) {
        startShell();
      });
    }
  });
};

startShell();

