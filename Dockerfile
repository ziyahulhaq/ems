FROM node:20

WORKDIR /app

COPY . .

RUN cd server && npm install
RUN cd frdend && npm install
RUN cd frdend && npm run build

EXPOSE 3444

CMD ["node", "server/index.js"]