const { spawn }  = require('child_process');

function Shell() {
}

Shell.prototype.write = function(command, callback) {
    var arg = command.split(' ');

    for(var i = 0; i < arg.length; i++) {
        arg[i] = arg[i].replace(/\s/g, '');
    }

    if(arg[0] === 'exit') {
      //  return rl.close();   
    } 
    else if(arg[0] === 'cd') {
        try {
            process.chdir(arg[1]);
            callback("Changed Directory");
        }
        catch (err) {
            callback("No Directory Found");
        }
    }
    else {
        var arg_1 = arg.shift();
        var child = spawn(arg_1, arg);
        
        child.stdout.on('data', (data) => {
            callback(data.toString());
        });
        child.stderr.on('data', (data) => {
            callback(data.toString());
        });
        child.on('error', function(err) {
            callback("Command not found...");
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            callback("\n");
        });
    }
};

module.exports = Shell;
