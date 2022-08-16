FROM node:12
WORKDIR /usr/src/app
COPY ./ ./
COPY package*.json ./
RUN npm install
# this should fix linebreak-style eslint error for Windows
RUN npm run lint
CMD ["npm", "run", "serve"]