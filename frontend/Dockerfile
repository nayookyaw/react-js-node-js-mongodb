#   **** Nay Oo Kyaw *** #
#   ** nayookyaw.nok@gmail.com *** #

FROM node:16.13

# set work directory
WORKDIR /frontend

# copy package.json to work directory, so that we install npm dependencies
COPY package.json /frontend

# install npm dependencies
# RUN npm install 
RUN yarn install

# grant access
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# copy your project files to work directory
COPY . /frontend

# run your app
# CMD ["npm", "start"] 
# OR CMD ['yarn', 'run', 'start']