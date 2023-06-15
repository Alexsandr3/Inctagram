FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/ ./prisma/

RUN yarn install

COPY . .

RUN yarn prisma generate --schema=prisma/schema.prisma

RUN yarn build images-ms

#EXPOSE 5004

CMD sh -c "yarn migrate:deploy && node ./dist/apps/images-ms/main"


FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/ ./prisma/

RUN yarn install --only=production

COPY . .

RUN yarn prisma generate --schema=prisma/schema.prisma

COPY --from=development /usr/src/app/dist ./dist

#CMD ["node", "dist/apps/images-ms/main"]
CMD sh -c "yarn migrate:deploy && node ./dist/apps/images-ms/main"