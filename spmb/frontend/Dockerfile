# GANTI INI: dari node:18-alpine ke node:22-alpine
FROM node:22-alpine 

RUN apk add --no-cache tzdata 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]