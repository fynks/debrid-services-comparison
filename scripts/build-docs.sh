#!/bin/bash

# Exit on any error and treat unset variables as errors
set -euo pipefail

# Colors for output
readonly GREEN='\033[0;32m'
readonly NC='\033[0m' # No Color
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'

# Script info
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Error handling function with line number
handle_error() {
    local line_number="${2:-unknown}"
    echo -e "${RED}Error on line ${line_number}: $1${NC}" >&2
    exit 1
}

# Trap errors and show line number
trap 'handle_error "Script failed" ${LINENO}' ERR

# Logging functions
log_info() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}" >&2
}

echo -e "${GREEN}Starting build-docs process...${NC}"

# 1. Check required files and directories
[ ! -d "docs" ] && handle_error "'docs' directory not found."
[ ! -f "README.md" ] && handle_error "'README.md' not found."

# 2. Function to extract div content with specific class from README.md
extract_div_content() {
    local class_name="$1"
    local start_line end_line
    
    # Find the start line of the div with the specified class
    start_line=$(grep -n "<div[^>]*class=\"${class_name}\"" README.md | head -1 | cut -d: -f1)
    
    if [ -z "$start_line" ]; then
        log_warn "No div with class '${class_name}' found in README.md"
        return 1
    fi
    
    # Find the corresponding closing </div></div> after the start line
    end_line=$(tail -n +$((start_line + 1)) README.md | grep -n "</div></div>" | head -1 | cut -d: -f1)
    
    if [ -z "$end_line" ]; then
        log_warn "No closing </div></div> found for class '${class_name}'"
        return 1
    fi
    
    # Calculate the actual end line number
    end_line=$((start_line + end_line))
    
    # Extract the content between start and end lines
    sed -n "${start_line},${end_line}p" README.md
}

# 3. Function to copy div content to docs file
copy_div_to_docs() {
    local class_name="$1"
    local target_file="$2"
    local content
    
    content=$(extract_div_content "$class_name")
    
    if [ $? -eq 0 ] && [ -n "$content" ]; then
        if [ -f "$target_file" ]; then
            # Append to existing file with separator
            {
                cat "$target_file"
                echo ""
                echo "$content"
            } > "${target_file}.tmp" && mv "${target_file}.tmp" "$target_file" || handle_error "Failed appending content to $target_file"
            log_info "Appended '$class_name' div content to $target_file"
        else
            # Create new file with content
            echo "$content" > "$target_file" || handle_error "Failed creating $target_file"
            log_info "Created $target_file with '$class_name' div content"
        fi
        
        # Adjust relative links for docs directory structure
        adjust_links_for_docs "$target_file"
    else
        log_warn "Failed to extract content for class '$class_name'"
    fi
}

# 4. Function to adjust links for docs directory structure
adjust_links_for_docs() {
    local file="$1"
    
    # Adjust relative links (skip absolute URLs)
    sed -i '/http[s]*:\/\/\//! s|\.\/docs/|\.\/|g' "$file" || handle_error "Failed adjusting links in $file"
    
    # Adjust image paths
    sed -i 's|docs/public/images/|public/images/|g' "$file" || handle_error "Failed adjusting image paths in $file"
    sed -i 's|\./dist/|public/images/|g' "$file" || handle_error "Failed adjusting dist image paths in $file"
    
    log_info "Adjusted links and image paths in $file"
}

# 5. Copy div sections to respective docs files
copy_div_to_docs "support" "docs/index.md"
copy_div_to_docs "pricing" "docs/pricing.md"
copy_div_to_docs "hosts" "docs/hosts.md"
copy_div_to_docs "policies" "docs/policies.md"
copy_div_to_docs "tools" "docs/tools.md"

# 6. Append speedtest content to the bottom of tools.md
speedtest_content=$(extract_div_content "speedtest")
if [ $? -eq 0 ] && [ -n "$speedtest_content" ]; then
    {
        cat "docs/tools.md"
        echo ""
        echo "---"
        echo ""
        echo "$speedtest_content"
    } > "docs/tools.md.tmp" && mv "docs/tools.md.tmp" "docs/tools.md" || handle_error "Failed appending speedtest content to docs/tools.md"
    log_info "Appended speedtest content to bottom of docs/tools.md"
    adjust_links_for_docs "docs/tools.md"
else
    log_warn "Failed to extract speedtest content"
fi

# 7. Remove standalone speedtest.md file if it exists
if [ -f "docs/speedtest.md" ]; then
    rm "docs/speedtest.md" || handle_error "Failed removing docs/speedtest.md"
    log_info "Removed standalone docs/speedtest.md file"
fi

echo -e "${GREEN}Documentation build process completed successfully.${NC}"
