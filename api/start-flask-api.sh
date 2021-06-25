#!/bin/bash
conda activate base
flask run -h 192.168.31.2 --no-debugger
echo "start-flask-api"
