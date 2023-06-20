import './lumen.scss';

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
});
