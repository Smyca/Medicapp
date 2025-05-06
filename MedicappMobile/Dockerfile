FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install

CMD ["npm","start"]

