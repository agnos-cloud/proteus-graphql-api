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

# the purpose of this stage is to install the dependencies like next-auth which require Node v 16
# before switching to Node v 18 for production
FROM base as preproduction
COPY package.json yarn.lock ./
RUN yarn install
# --production=true --frozen-lockfile
RUN yarn build

FROM node:18.12.0 as production
WORKDIR /home/node/app
EXPOSE 80
COPY package.json yarn.lock ./
COPY --from=preproduction /home/node/app/dist ./dist
COPY --from=preproduction /home/node/app/node_modules ./node_modules
CMD yarn start
