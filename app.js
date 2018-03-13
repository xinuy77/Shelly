const { spawn } = require('child_process');

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startShell() {
    var arg;

    rl.question('Command: ', function(command) {
        arg = command.split(' ');

        if(arg[0] === 'exit') {
            return rl.close();   
        } 
        else if(arg[0] === 'cd') {
            process.chdir(arg[1]);
            startShell(); 
        }
        else {
            var arg_1 = arg.shift();
            var child = spawn(arg_1, arg, { 
                stdio: 'inherit'
            });

            child.on('exit', function(e, code) {
                startShell();
            });

            child.on('error', function(err) {
                console.log(err);
                startShell();
            });
        }
    });
};

startShell();

