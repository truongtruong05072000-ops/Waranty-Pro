const fs = require('fs');

const html = fs.readFileSync('_build/app_template2.html', 'utf8');

const makeEl = () => ({ 
  innerHTML: '', 
  textContent: '', 
  value: '', 
  style: {}, 
  classList: { toggle: ()=>{}, add: ()=>{}, remove: ()=>{} },
  addEventListener: () => {},
  getAttribute: () => '',
  querySelectorAll: () => []
});
global.window = global;
global.window.location = { href: 'http://localhost/test', pathname: '/' };
global.window.addEventListener = () => {};
global.document = {
  documentElement: makeEl(),
  getElementById: () => makeEl(),
  querySelector: () => makeEl(),
  querySelectorAll: () => []
};
global.$ = () => makeEl();
global.$$ = () => [];
global.localStorage = { getItem: () => null, setItem: () => {} };

const scriptMatches = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
eval(scriptMatches[0][1]);

console.log('Testing isSettledOrHigher directly:');
console.log('  isSettledOrHigher("waiting_approval"):', isSettledOrHigher("waiting_approval"));
console.log('  isSettledOrHigher("waiting_approval", {}):', isSettledOrHigher("waiting_approval", {}));
console.log('  norm("waiting_approval"):', norm("waiting_approval"));
