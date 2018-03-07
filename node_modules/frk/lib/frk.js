const frk = require('bindings')('frk');

module.exports = fn => {
  let done, err;
  const promise = new Promise((acc, rej) => {
    done = acc;
    err = rej;
  });

  const pid = frk.run(done, fn);
  return {
    getPID: () => pid,
    getStatus: () => promise
  }
}
