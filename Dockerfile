FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install -D ts-node-dev 
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run","dev"]  
