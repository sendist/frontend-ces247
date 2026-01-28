# frontend/Dockerfile
FROM node:24.12.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]