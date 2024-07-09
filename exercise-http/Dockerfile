
FROM node:14

WORKDIR /usr/src/app


RUN set -x && apt-get update && apt-get install -y python-pip
RUN set -x && pip install psycopg2-binary

RUN mkdir -p /tmp/storage-fs && chmod -R 777 /tmp/storage-fs

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

USER node

EXPOSE 5001

# Command to run the app when the container starts
CMD [ "node", "index.js" ]
