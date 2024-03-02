FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run

ENV PORT=8001

EXPOSE ${PORT}

CMD ["npm", "start"]