const coin = () => Math.random() > 0.5;
const promiseQueue = [];
const apiRequest = params => {
  return new Promise((resolve, reject) => {
    return promiseQueue.push({ resolve, reject });
    setTimeout(function() {
      coin() ? resolve() : reject();
    }, 1000);
  });
};

const runTaskFromQueue = () => {
  const task = promiseQueue.shift();
  if (task) {
    coin() ? task.resolve() : task.reject();
    runTaskFromQueue();
  }
};

const getModule = () => apiRequest({ api: '/api/getModule' });

getModule()
  .then(() => {
    console.log('getModule fullfilled');
  })
  .catch(e => {
    console.log('getModule rejected');
  });

getModule()
  .then(() => {
    console.log('getModule fullfilled 2');
  })
  .catch(e => {
    console.log('getModule rejected 2');
  });

runTaskFromQueue();
