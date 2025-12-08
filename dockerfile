FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env .env
COPY .env.local .env.local

COPY . .

RUN npm run build

CMD ["npm", "start"]
