const { spawn } = require('child_process');
const { exec }  = require('child_process');

var nativeCmds;

function Shell(nativeCommands) {
    nativeCmds = nativeCommands;
}

Shell.prototype.write = function(command, callback) {
    var arg      = command.split(' ');
    var child;
    var arg_1;

    for(var i = 0; i < arg.length; i++) {
        arg[i] = arg[i].replace(/\s/g, '');
    }

    arg_1 = arg.shift();

    for(var i = 0; i < nativeCmds.length; i++) {
        if(arg_1 === "regcmd") {
            if(arg[0] === nativeCmds[i]) {
                callback("This Command is already registered.");
                return;
            }
        }
        if(nativeCmds[i] === arg_1) {
            var option = ["-x", arg_1];

            child = spawn("gnome-terminal", option.concat(arg));
            callback("Command Complete");
            return;
        }
    }

    if(arg_1 === 'exit') {
        window.close();
    }
    else if(command.length === 0) {
        callback("Please Enter Command");
    }
    else if(arg_1 === 'clear') {
        callback("CLEAR");
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
    else if (arg_1 === 'regcmd') {
        nativeCmds.push(arg[0]);
        callback(nativeCmds);
    }
    else {
        child = exec(command);

        child.stdout.on('data', (data) => {
            callback(data.toString().replace(/\n/g, "<br />"));
        });
        child.stderr.on('data', (data) => {
            callback(data.toString().replace(/\n/g, "<br />"));
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
