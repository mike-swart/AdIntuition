#!/bin/bash

rm src.zip
cd src
FILES=$(ls -p | grep -v /)
echo $FILES
zip -r ../src.zip $FILES logos/logo.png mutation-summary/src
