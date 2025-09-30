FROM node:22

WORKDIR /app

COPY web/package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]