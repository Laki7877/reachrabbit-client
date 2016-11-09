FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g grunt-cli

# Bundle app source
COPY . /usr/src/app
RUN grunt production

EXPOSE 443 80

CMD [ "node", "server.js" ]