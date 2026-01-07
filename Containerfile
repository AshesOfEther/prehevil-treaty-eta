FROM docker.io/node:22-alpine3.23

WORKDIR /app

COPY --parents package.json package-lock.json backend/package.json common/package.json ./
RUN npm install --workspaces
COPY --parents backend/prisma ./
RUN npm run --workspace backend prisma:generate
COPY --parents backend/src common/src ./

RUN adduser -D prehevil-treaty
USER prehevil-treaty

EXPOSE 8000
ENV PORT=8000
CMD npm start --workspace backend
