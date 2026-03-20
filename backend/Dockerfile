FROM node:22-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev"]