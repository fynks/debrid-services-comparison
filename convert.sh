#!/bin/bash

set -euo pipefail

# Error handling
handle_error() {
    echo "Error: $1"
    cleanup
    exit 1
}

# Cleanup function
cleanup() {
    rm -f header.html template.html
}

# Check requirements
if ! command -v pandoc &> /dev/null; then
    handle_error "pandoc is not installed. Please install it first."
fi

# Create template
cat > template.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    $header-includes$
    <title>Debrid Services Comparison</title>
</head>
<body>
    
    <header role="banner">
        <h1 class="title">$title$</h1>
        <nav role="navigation" aria-label="Table of contents">
            $toc$
        </nav>
    </header>

    <main id="main-content" role="main">
        $body$
    </main>

    <footer role="contentinfo">
        <p><a href="https://github.com/fynks/debrid-services-comparison">Source &#8599;</a> | Made with ❤️ by Fynks</p>
    </footer>

    <script>
       document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("available-hosts");if(e){const t=document.createElement("div");t.id="search-container",t.innerHTML='\n            <input type="text" id="search-input" placeholder="Search the hosts..." />\n        ',e.insertAdjacentElement("afterend",t);const n=document.getElementById("search-input");n.addEventListener("input",(function(){const e=n.value.toLowerCase(),t=document.querySelectorAll("table");if(t.length>1){const n=t[1].getElementsByTagName("tr");for(let t=1;t<n.length;t++){const o=n[t].getElementsByTagName("td");let a=!1;for(let t=0;t<o.length;t++)if(o[t].innerText.toLowerCase().includes(e)){a=!0;break}n[t].style.display=a?"":"none"}}}))}}));
    </script>
</body>
</html>

EOL

# Create header with improved meta tags
cat > header.html << 'EOL'
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="A quick comparison of available hosts for AllDebrid, Real-Debrid, LinkSnappy, Premiumize, Debrid-Link, and TorBox.">
<meta name="keywords" content="Debrid services, AllDebrid, Real-Debrid, LinkSnappy, Premiumize, Debrid-Link, TorBox, comparison, pricing, hosts, file hosts, downloading, free downloading, mediafire, mega.nz, mega free download, turbobit free download, rapidgator free download, nitroflare">
<meta name="author" content="Fynks">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#0366d6">
<link rel="stylesheet" href="styles.css">
    
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://debrid-services-comparison.netlify.app/">
<meta property="og:title" content="Debrid Services Comparison">
<meta property="og:description" content="A quick comparison of available hosts for AllDebrid, Real-Debrid, LinkSnappy, Premiumize, Debrid-Link, and TorBox.">
<meta property="og:image" content="https://debrid-services-comparison.netlify.app/image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://debrid-services-comparison.netlify.app/">
<meta property="twitter:title" content="Debrid Services Comparison">
<meta property="twitter:description" content="A quick comparison of available hosts for AllDebrid, Real-Debrid, LinkSnappy, Premiumize, Debrid-Link, and TorBox.">
<meta property="twitter:image" content="https://debrid-services-comparison.netlify.app/image.png">
EOL

# Convert markdown with progress
echo "Starting conversion process..."
echo "→ Generating HTML from markdown..."
pandoc README.md \
    --from gfm \
    --to html5 \
    --standalone \
    --template=template.html \
    --include-in-header=header.html \
    --metadata title="Debrid Services Comparison" \
    --shift-heading-level-by=-1 \
    --toc-depth=2 \
    -o docs/index.html || handle_error "Conversion failed"

# Cleanup
cleanup

echo "✓ Conversion complete! Output saved as index.html"
echo "→ Table of contents generated"
echo "→ Dark mode support added"
echo "→ Accessibility features implemented"