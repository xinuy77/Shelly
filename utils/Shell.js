
function Shell() {
}

Shell.prototype.write = function(command) {
    var arg = command.split(' ');

    if(arg[0] === 'exit') {
      //  return rl.close();   
    } 
    else if(arg[0] === 'cd') {
        process.chdir(arg[1]);
    }
    else {
        var arg_1 = arg.shift();
        var child = spawn(arg_1, arg, { 
        });
/*
        child.stdout.on('data', function(data) {
            console.log(data);
        });
*/
        child.on('exit', function(e, code) {
        });

        child.on('error', function(err) {
            console.log("Command not found...");
            console.log(err);
            console.log(command);
        });
    }
};

module.exports = Shell;
