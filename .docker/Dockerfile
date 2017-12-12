FROM node:7-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /mirage

RUN npm install -g bower
RUN npm install -g gulp
RUN npm install -g http-server

ADD . /mirage

RUN npm install
RUN bower install --allow-root
RUN npm build

EXPOSE 3030
CMD ["http-server", "-p 3030"]
