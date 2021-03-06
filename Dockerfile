FROM node:12

ARG build

ENV B=${build}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "yarn ${B}"]