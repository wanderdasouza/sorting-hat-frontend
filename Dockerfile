FROM node

ENV APP_PATH=/usr/src/frontend \
    PORT=3000 \
    HOST=0.0.0.0

WORKDIR ${APP_PATH}

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD npm run start
