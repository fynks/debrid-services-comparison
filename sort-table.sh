#!/bin/bash

# filepath: /home/ali/Github/debrid-services-comparison/sort_table.sh

# Extract the header and the table content
header=$(head -n 1 /home/ali/Github/debrid-services-comparison/README.md)
table=$(tail -n +2 /home/ali/Github/debrid-services-comparison/README.md)

# Sort the table content by the first column
sorted_table=$(echo "$table" | sort -t '|' -k 2)

# Combine the header and the sorted table
echo "$header" > /home/ali/Github/debrid-services-comparison/README_sorted.md
echo "$sorted_table" >> /home/ali/Github/debrid-services-comparison/README_sorted.md

echo "Table sorted and saved to README_sorted.md"