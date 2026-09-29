// App entry — boots the page, registers the service worker, and
// hands off to the root component.

import './styles/globals.css';

import { renderApp } from './app.js';
import fileHosts from './json/file-hosts-optimized.json';
import adultHosts from './json/adult-hosts-optimized.json';
import { registerServiceWorker } from './lib/sw.js';

const root = document.getElementById('app');
if (!root) throw new Error('App container #app not found.');

renderApp(root, { fileHosts, adultHosts });
registerServiceWorker();