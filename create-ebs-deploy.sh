#!/bin/bash
bundle package --all
rm ../rails-latest-sf.zip
zip ../rails-latest-sf.zip -r * .[^.]* -x ./node_modules/\* -x .git/\* -x tmp/\* -x log/\* -x public/assets\* -x public/pack\*
