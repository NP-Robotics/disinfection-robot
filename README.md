This project is developed on an Nvidia Xavier AGX with JetPack 4.5, CUDA 10.2, Ubuntu 18.04, ROS Melodic, Python 3.6, OpenCV 4.5.0, Tensorflow 2.5.0

It is also deployed on an Intel NUC running Ubuntu 18.04. In the prototype clinic robot, startup services are already created to automatically run all the necessary commands in the backend and open up the browser to the webpage. 

### Set up the project...

First, create a virtual python environment, activate it, and clone the project into a folder.

git clone

`git clone https://github.com/NP-Robotics/disinfection-robot.git`

install yarn

`sudo apt-get install curl`

`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

`sudo apt update`

`sudo apt install yarn`

install the latest node

`curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -`

`sudo apt-get install nodejs`

`yarn`

install flask and other required modules

`pip install Flask`

`pip install -U flask-cors`

`pip install python-dotenv`

install tensorflow

https://www.pyimagesearch.com/2019/01/30/ubuntu-18-04-install-tensorflow-and-keras-for-deep-learning/

install the latest openCV

https://forums.developer.nvidia.com/t/installing-opencv4-on-xavier-solved/65436

(Ensure that all package paths points to the correct location based on your computer)


### Start the project...

Open three separate terminals and `cd` into the project's root folder (and activate your virtual environment):

To start the local react webpage,

`yarn start`

To start username and password server,

`node server.js`

To start flask API for camera functionalities,

`cd api` and `export FLASK_APP=app.py`

`cd..` and `yarn start-flask-api`
