const frk = require('../');

let pid = '[not started yet]';

setInterval(() => {
  console.log("Main continues to run, while PID is", pid);
}, 700);

setTimeout(function () {
  console.log("Starting to fork!");
  
  let props = frk(function () {
    console.log("logs being printed from child");
    for (let i=0; i<10;i++) {
      console.log("doing some heavy calculations!")
      while(Math.floor(10000000*Math.random()) != 42);
    }
    console.log("child is exiting with code exit code 42");
    process.exit(42);
  });

  pid = props.getPID();

  props.getStatus().then(exitCode => {
    console.log("child exit code received in parent", exitCode);
  });
}, 2000);
