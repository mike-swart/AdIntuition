#!/bin/bash

rm src.zip
cd src
FILES=$(ls -p | grep -v / | grep -v "search.js")
echo $FILES
zip -r ../src.zip $FILES logos/* modules/mutation-summary/src modules/crypto-js/* modules/jsencrypt.min.js
