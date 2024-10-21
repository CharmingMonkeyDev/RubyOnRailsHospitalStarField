#!/bin/bash
# If you are getting the nokogiri not found error on EBS, uncomment the following 3 lines and run again - GL
rm -rf vendor/cache
bundle config set force_ruby_platform true
# bundle install
bundle package --all
mv ../rails-default* ../pharm-deploy-backups
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
file_name="rails-default-sf"."$current_time"."zip"
zip ../$file_name  -r * .[^.]* -x "./node_modules/*" "./.git/*" "./tmp/*" "./log/*" "./storage/*"