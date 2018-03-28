const { spawn } = require('child_process');

function Shell() {
}

Shell.prototype.write = function(command, callback) {
    var arg = command.split(' ');
    var child;
    var arg_1;

    for(var i = 0; i < arg.length; i++) {
        arg[i] = arg[i].replace(/\s/g, '');
    }

    arg_1 = arg.shift();

    if(arg_1 === 'exit') {
        window.close();
    } 
    else if(arg_1 === 'cd') {
        try {
            process.chdir(arg[0]);
            callback("Changed Directory");
        }
        catch (err) {
            callback("No Directory Found");
        }
    }
    else if(arg_1 === 'vim' || (arg_1 === 'git' && arg[0] === 'push')) {
        var option = ["-x", arg_1];

        if(arg_1 == 'vim') {
            arg.push("&&");
            arg.push("exit");
        }

        child = spawn("gnome-terminal", option.concat(arg));
    }
    else {
        child = spawn(arg_1, arg);
        child.stdout.on('data', (data) => {
            callback(data.toString());
        });
        child.stderr.on('data', (data) => {
            callback(data.toString());
        });
        child.on('error', function(err) {
            callback("Command Not Found");
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            callback("\n");
        });
    }
};

module.exports = Shell;
