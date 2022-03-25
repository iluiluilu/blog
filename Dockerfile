FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app src
COPY package.json .

# Install app dependencies
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "watch" ]
