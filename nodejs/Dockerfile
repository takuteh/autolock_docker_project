FROM node:20.11.1
WORKDIR /app

COPY ./package.json .
COPY ./etc /app/etc
COPY ./src /app/src
RUN npm install

CMD ["npm","start"]
