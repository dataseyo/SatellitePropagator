FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_DEV_API
ENV NEXT_PUBLIC_DEV_API=$NEXT_PUBLIC_DEV_API
RUN npm run build

FROM base as deploy
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start", "--host"]