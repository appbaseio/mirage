FROM node:7-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /mirage
ADD package.json yarn.lock /mirage/

RUN apk --no-cache update && apk --no-cache add git && rm -rf /var/cache/apk/*
RUN apk add --no-cache make gcc g++ python
RUN yarn global add bower
RUN yarn global add gulp
RUN yarn global add http-server

ADD . /mirage

RUN bower install --allow-root
RUN yarn && yarn cache clean && yarn build
RUN apk del make gcc g++ python git

EXPOSE 3030
CMD ["http-server", "-p 3030"]
