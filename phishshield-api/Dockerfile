FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

EXPOSE 3005

CMD ["npm", "start"]