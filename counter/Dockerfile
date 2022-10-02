FROM node:15.14

WORKDIR /app

ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY src ./src

CMD ["npm", "start"]