FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm cache clean -f
RUN npm install -g n
RUN n stable


# Bundle app source
COPY . /usr/src/app
RUN npm install
RUN npm install -g grunt-cli
RUN grunt production
#RUN rm -rf app/bower_components
RUN rm -rf node_modules
RUN npm install --only=production

EXPOSE 443 80

CMD [ "node", "server.js" ]