#!/bin/bash

echo '\n\033[0;32m\033[1m- Installing npm modules\033[0m'
docker run -v /$(pwd):/app -w="//app" node npm install