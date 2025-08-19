const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');

html = html
  .replace(/href=["']\.\/css\/styles\.css["']/g, 'href="./css/styles-min.css"')
  .replace(/src=["']js\/app\.js["']/g, 'src="js/app-min.js"');

fs.writeFileSync(file, html, 'utf8');
console.log('Replaced asset links in dist/index.html');