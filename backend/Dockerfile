#   **** Nay Oo Kyaw *** #
#   ** nayookyaw.nok@gmail.com *** #

FROM node:16.13 as base

WORKDIR /node-server

COPY package.json ./

FROM base as dev
ENV NODE_ENV=development

RUN npm install -g nodemon
RUN npm install

COPY . .
# CMD ["npm", "run", "dev"]
# CMD npm start
