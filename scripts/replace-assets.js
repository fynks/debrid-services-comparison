const fs = require('fs');
const path = require('path');

// Improved script with better error handling and logging
function replaceAssets() {
  const file = path.resolve(__dirname, '..', 'dist', 'index.html');
  
  // Check if dist/index.html exists
  if (!fs.existsSync(file)) {
    console.error('Error: dist/index.html not found');
    process.exit(1);
  }

  try {
    let html = fs.readFileSync(file, 'utf8');
    console.log('Original HTML loaded successfully');

    // Store original for comparison
    const originalHtml = html;

    // Replace CSS links
    html = html.replace(/href=["']\.\/css\/styles\.css["']/g, 'href="./css/styles-min.css"');
    
    // Replace JS links - fixed regex to match your exact pattern
    html = html.replace(/src=["']\.?\/js\/app\.js["']/g, 'src="js/app-min.js"');

    // Check if any replacements were made
    if (html === originalHtml) {
      console.warn('Warning: No asset links were found to replace');
      console.log('This might indicate that the HTML structure has changed');
    } else {
      console.log('Asset links replaced successfully');
    }

    // Write the updated HTML back
    fs.writeFileSync(file, html, 'utf8');
    console.log('Updated dist/index.html saved');

    // Verify the minified files exist
    const cssFile = path.resolve(__dirname, '..', 'dist', 'css', 'styles-min.css');
    const jsFile = path.resolve(__dirname, '..', 'dist', 'js', 'app-min.js');

    if (!fs.existsSync(cssFile)) {
      console.warn('Warning: styles-min.css not found - CSS minification may have failed');
    }
    
    if (!fs.existsSync(jsFile)) {
      console.warn('Warning: app-min.js not found - JS minification may have failed');
    }

  } catch (error) {
    console.error('Error processing HTML file:', error.message);
    process.exit(1);
  }
}

replaceAssets();