#!bin/bash

../../node_modules/.bin/http-server ./myApp -c-1 -o -p 2224 #myApp
../../node_modules/.bin/http-server ./mainApp -c-1 -o -p 2223 #mainApp
../../node_modules/.bin/http-server ./otherApp -c-1 -o -p 2225 #otherApp
