# node_modules wird vom Host vorbereitet und ins Image kopiert.
# Dadurch muss der Build-Container keinen Netzzugriff haben.
# Workflow:
#   npm install              # einmalig auf dem Host (nutzt deine npm-Config, ggf. Nexus)
#   docker compose up -d     # Image bauen + Stack starten

FROM node:22-bookworm-slim

WORKDIR /app

# Optional: CA-Zert für Firmen-Proxy in den Runtime-Truststore aufnehmen
ARG CA_CERT_PATH=""
RUN if [ -n "$CA_CERT_PATH" ] && [ -f "$CA_CERT_PATH" ]; then \
      apt-get update && \
      apt-get install -y --no-install-recommends ca-certificates && \
      rm -rf /var/lib/apt/lists/* && \
      cp "$CA_CERT_PATH" /usr/local/share/ca-certificates/corp-root.crt && \
      update-ca-certificates; \
    fi

# Optional: npm-Registry im Container setzen (für Tools, die nachinstallieren)
ARG NPM_REGISTRY="https://registry.npmjs.org/"
RUN npm config set registry "$NPM_REGISTRY"

COPY package.json package-lock.json* ./
COPY node_modules ./node_modules
COPY server.js ./
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
