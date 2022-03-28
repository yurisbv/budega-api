FROM node:17 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:17-alpine3.12
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]
