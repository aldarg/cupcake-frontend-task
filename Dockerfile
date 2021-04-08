FROM node:14.15.4-alpine
RUN npm install pm2 serve -g
WORKDIR /usr/client_app
COPY . .
RUN yarn install --pure-lockfile --non-interactive
EXPOSE 5000
RUN yarn build
CMD [ "pm2-runtime", "start", "serve", "--", "dist" ]