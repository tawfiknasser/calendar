FROM node:12
WORKDIR /usr/src/app
COPY ./ ./
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "serve"]