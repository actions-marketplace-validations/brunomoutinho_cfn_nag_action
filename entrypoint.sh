#!/bin/sh

set -e

# Copy the matcher to the host system; otherwise "add-matcher" can't find it.
matcher_path=`pwd`/cfn_nag_matcher.json
cp /cfn_nag_matcher.json "$matcher_path"
echo "::add-matcher::cfn_nag_matcher.json"

# Copy JS function to the host system; otherwise system can't find it.
format_output_path=`pwd`/format_output.js
cp /format_output.js "$format_output_path"

sh -c "$(cfn_nag_scan --output-format=json --input-path $* > cfn_nag_scan_output.txt)"
node format_output.js

