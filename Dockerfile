FROM node:16 as base
WORKDIR /home/node/app
EXPOSE 3000

FROM base as test
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD yarn test  --detectOpenHandles

FROM base as development
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# RUN yarn build
CMD yarn dev

FROM base as preproduction
COPY package.json yarn.lock ./
RUN yarn install --production=true --frozen-lockfile

FROM node:18.12.0 as production
WORKDIR /home/node/app
EXPOSE 80
COPY package.json yarn.lock ./
COPY --from=preproduction /home/node/app/dist ./dist
COPY --from=preproduction /home/node/app/node_modules ./node_modules
CMD yarn start
