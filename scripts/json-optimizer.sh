#!/bin/bash

# JSON Optimizer Script - Converts host data to indexed format
# Usage: ./scripts/json-optimizer.sh file-hosts.json
#        ./scripts/json-optimizer.sh adult-hosts.json
#        ./scripts/json-optimizer.sh pricing.json

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_INPUT_DIR="."
DEFAULT_OUTPUT_DIR="."

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    print_error "No input file specified"
    echo "Usage: $0 <input-file.json> [output-file.json]"
    echo "Examples:"
    echo "  $0 file-hosts.json"
    echo "  $0 ./json/adult-hosts.json"
    echo "  $0 pricing.json pricing-optimized.json"
    exit 1
fi

# Get input file
INPUT_FILE="$1"

# Generate output filename if not provided
if [ $# -eq 2 ]; then
    OUTPUT_FILE="$2"
else
    # Extract filename without path and extension
    FILENAME=$(basename "$INPUT_FILE")
    NAME="${FILENAME%.*}"
    EXT="${FILENAME##*.}"
    OUTPUT_FILE="${NAME}-optimized.${EXT}"
fi

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    print_error "Input file '$INPUT_FILE' not found"
    exit 1
fi

# Create output directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT_FILE")
if [ ! -d "$OUTPUT_DIR" ] && [ "$OUTPUT_DIR" != "." ]; then
    print_status "Creating output directory: $OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
fi

print_status "Processing: $INPUT_FILE"
print_status "Output will be saved to: $OUTPUT_FILE"

# Python script to handle the conversion
python3 -c "
import json
import sys
import os
from collections import defaultdict

def convert_to_indexed_format(input_file, output_file):
    try:
        # Read the input JSON
        print('Reading input file...')
        with open(input_file, 'r') as f:
            data = json.load(f)
        
        host_count = len(data)
        print(f'Loaded {host_count:,} hosts')
        
        # Handle empty data
        if not data:
            print('Warning: Input file is empty')
            output_data = {'services': [], 'supported': {}}
            with open(output_file, 'w') as f:
                json.dump(output_data, f, separators=(',', ':'))
            return True
        
        # Extract all services (keys from entries)
        all_services = set()
        for host_data in data.values():
            all_services.update(host_data.keys())
        
        services = sorted(list(all_services))
        service_count = len(services)
        print(f'Found {service_count} services: {\", \".join(services[:5])}{\"...\" if service_count > 5 else \"\"}')
        
        # Create service to index mapping
        service_to_index = {service: idx for idx, service in enumerate(services)}
        
        # Convert data to indexed format
        print('Converting data to indexed format...')
        supported = {}
        total_support_instances = 0
        
        for host, host_data in data.items():
            # Get indices of services with 'yes' values (case insensitive)
            supported_indices = [
                service_to_index[service] 
                for service, value in host_data.items() 
                if str(value).lower() == 'yes'
            ]
            supported[host] = sorted(supported_indices)
            total_support_instances += len(supported_indices)
        
        # Create output structure
        output_data = {
            'services': services,
            'supported': supported
        }
        
        # Write optimized JSON (compact format)
        print('Writing optimized JSON...')
        with open(output_file, 'w') as f:
            json.dump(output_data, f, separators=(',', ':'))
        
        # Get file sizes for comparison
        original_size = os.path.getsize(input_file)
        new_size = os.path.getsize(output_file)
        reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
        
        print('✅ Conversion successful!')
        print(f'📁 Original size: {original_size:,} bytes')
        print(f'📁 New size: {new_size:,} bytes')
        print(f'📉 Size reduction: {reduction:.1f}%')
        print(f'💾 Output saved to: {output_file}')
        
        # Show statistics
        avg_support_per_host = total_support_instances / host_count if host_count > 0 else 0
        
        print('📈 Statistics:')
        print(f'   - Hosts: {host_count:,}')
        print(f'   - Services: {service_count:,}')
        print(f'   - Total support instances: {total_support_instances:,}')
        print(f'   - Average support per host: {avg_support_per_host:.1f}')
        
        return True
        
    except json.JSONDecodeError as e:
        print(f'❌ JSON parsing error: {str(e)}')
        return False
    except Exception as e:
        print(f'❌ Error during conversion: {str(e)}')
        return False

# Run the conversion
success = convert_to_indexed_format('$INPUT_FILE', '$OUTPUT_FILE')

if not success:
    sys.exit(1)
" || {
    print_error "Python conversion failed. Please ensure Python 3 is installed."
    exit 1
}

print_success "Conversion completed successfully!"

# Optional: Show file size comparison in bash as well
if command -v stat >/dev/null 2>&1; then
    ORIGINAL_SIZE=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE" 2>/dev/null)
    NEW_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ $ORIGINAL_SIZE -gt 0 ]; then
        REDUCTION_PERCENTAGE=$(( (ORIGINAL_SIZE - NEW_SIZE) * 100 / ORIGINAL_SIZE ))
        print_status "Final size reduction: ${REDUCTION_PERCENTAGE}%"
    fi
fi