#According to the tutorial, these are the basic steps of making a docker image

# 1. Specify a base image
#using v16 because of a bug in libraries like Webpack and Create react app cause by Node v17
FROM node:16-alpine
 
# Optional standard: put all files in this directory
WORKDIR /app

# 2. Install some dependencies
#this step makes sure we dont have to keep reinstalling
#packages whenever we make edits on other files
#as it will be cached
COPY package.json ./ 

#--only=prod: does not install our testing packages/dependancies
RUN npm install
COPY . .

# 3. Default command
CMD ["npm", "run", "dev"]