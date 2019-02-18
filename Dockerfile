FROM node:7-alpine
MAINTAINER appbase.io <info@appbase.io>

WORKDIR /mirage
ADD package.json yarn.lock /mirage/

RUN apk --no-cache update && apk --no-cache add git make gcc g++ python && rm -rf /var/cache/apk/*
RUN yarn global add bower gulp http-server

ADD . /mirage

RUN bower install --allow-root && yarn && yarn cache clean && yarn build_gh_pages && rm -rf /mirage/bower_components && rm -rf /tmp/*

EXPOSE 3030
CMD ["http-server", "-p 3030"]
