// only required for dev
// in prod, foundry loads index.js, which is compiled by vite/rollup
// in dev, foundry loads index.js, this file, which loads lumen.ts

// eslint-disable-next-line no-undef
window.global = window; // some of your dependencies might need this
import * as LUMEN from './lumen.ts';
