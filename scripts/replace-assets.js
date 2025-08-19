const fs = require('fs');
const path = require('path');

// Improved script with better error handling and focused head tag processing
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

    // Extract the head section
    const headMatch = html.match(/(<head[^>]*>)([\s\S]*?)(<\/head>)/i);
    if (!headMatch) {
      console.error('Error: Could not find <head> tag in HTML');
      process.exit(1);
    }

    const [fullHeadTag, headStart, headContent, headEnd] = headMatch;
    console.log('Head section found, processing assets...');

    let updatedHeadContent = headContent;
    let cssReplaced = 0;
    let jsReplaced = 0;

    // Replace CSS links in head - more flexible patterns
    const cssPatterns = [
      /href=["']\.\/css\/styles\.css["']/g,
      /href=["']css\/styles\.css["']/g,
      /href=["'][^"']*\/styles\.css["']/g
    ];

    cssPatterns.forEach(pattern => {
      const matches = updatedHeadContent.match(pattern);
      if (matches) {
        updatedHeadContent = updatedHeadContent.replace(pattern, 'href="./css/styles-min.css"');
        cssReplaced += matches.length;
      }
    });

    // Replace JS script src in head - more flexible patterns
    const jsPatterns = [
      /src=["']\.\/js\/app\.js["']/g,
      /src=["']js\/app\.js["']/g,
      /src=["'][^"']*\/app\.js["']/g
    ];

    jsPatterns.forEach(pattern => {
      const matches = updatedHeadContent.match(pattern);
      if (matches) {
        updatedHeadContent = updatedHeadContent.replace(pattern, 'src="js/app-min.js"');
        jsReplaced += matches.length;
      }
    });

    // Also check for script tags at the end of body (common pattern)
    const bodyMatch = html.match(/(<body[^>]*>)([\s\S]*?)(<\/body>)/i);
    if (bodyMatch) {
      const [fullBodyTag, bodyStart, bodyContent, bodyEnd] = bodyMatch;
      let updatedBodyContent = bodyContent;

      jsPatterns.forEach(pattern => {
        const matches = updatedBodyContent.match(pattern);
        if (matches) {
          updatedBodyContent = updatedBodyContent.replace(pattern, 'src="js/app-min.js"');
          jsReplaced += matches.length;
        }
      });

      // Reconstruct the body if changes were made
      if (updatedBodyContent !== bodyContent) {
        html = html.replace(fullBodyTag, bodyStart + updatedBodyContent + bodyEnd);
      }
    }

    // Reconstruct the HTML with updated head
    const updatedHeadTag = headStart + updatedHeadContent + headEnd;
    html = html.replace(fullHeadTag, updatedHeadTag);

    // Log results
    console.log(`CSS replacements made: ${cssReplaced}`);
    console.log(`JS replacements made: ${jsReplaced}`);

    if (cssReplaced === 0 && jsReplaced === 0) {
      console.warn('Warning: No asset links were found to replace');
      console.log('Checking for existing patterns in head section:');
      
      // Debug: show what's actually in the head
      const linkTags = headContent.match(/<link[^>]*>/gi) || [];
      const scriptTags = headContent.match(/<script[^>]*>/gi) || [];
      
      console.log('Found link tags:', linkTags);
      console.log('Found script tags:', scriptTags);
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
    } else {
      console.log('✓ styles-min.css exists');
    }
    
    if (!fs.existsSync(jsFile)) {
      console.warn('Warning: app-min.js not found - JS minification may have failed');
    } else {
      console.log('✓ app-min.js exists');
    }

  } catch (error) {
    console.error('Error processing HTML file:', error.message);
    process.exit(1);
  }
}

replaceAssets();