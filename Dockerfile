#This Dockerfile customises the Docker image that we create

#pull official base image
FROM node:alpine

#set working directory
WORKDIR /app

#install app dependencies
COPY package.json .
RUN yarn

#copy all source code
COPY . .

#expose port 3000
EXPOSE 3000

#start app
CMD ["yarn","start"]  

#docker build -t {image name} .
#docker image ls
#docker image rm {image ID}
#docker ps

#docker run -d -p 3000:3000 --name disinfection-robot disinfection-robot
#docker rm disinfection-robot -f

#docker pull
#docker tag {local-image}:{tagname} {repo}:{tagname} (docker tag disinfection-robot:latest alsonjiang/disinfection-robot:latest)
#docker login
#docker push {repo}:{tagname} (alsonjiang/disinfection-robot:latest)