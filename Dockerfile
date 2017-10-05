FROM node:6-alpine

RUN apk add --no-cache --virtual git

CMD ["yarn", "test"]
