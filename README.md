install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

### `yarn start`

To start local server

### `node server.js`

To start username and password server

### `cd api`and `export FLASK_APP=app.py`
if running server on Nvidia Xavier

Camera functionalities:

Turn on power and connect thermal camera to your laptop

### `cd api` and access main.py

Uncomment line 84 and comment line 85 for local video source
Uncomment line 85 and comment line 84 for Thermal Camera

### `yarn start-flask-api`

To start camera API

In the local browser, click the camera icon to open up camera page. The stream should start automatically
