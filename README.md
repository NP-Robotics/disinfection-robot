### Set up the project...

First, create a virtual environment and activate it and clone the project into a folder.

git clone

`git clone https://github.com/NP-Robotics/disinfection-robot.git`

install yarn

`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

`sudo apt update`

`sudo apt install yarn`

update node (if there is an error)

`sudo npm cache clean -f`

`sudo npm install -g n`

`sudo n latest`

install flask and other required modules

`pip install Flask`

`pip install -U flask-cors`

`pip install python-dotenv`

### Start the project...

Open three separate terminals and `cd` into the project's root folder (and activate your virtual environment):

To start the local react webpage,

`yarn start`

To start username and password server,

`node server.js`

To start flask API for camera functionalities,

`cd api` and `export FLASK_APP=app.py`

`cd..` and `yarn start-flask-api`
