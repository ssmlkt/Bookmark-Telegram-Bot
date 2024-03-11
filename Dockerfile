FROM node:16
WORKDIR /app
ADD . .
RUN npm install
EXPOSE 3000 
CMD ["npm", "run", "start"]