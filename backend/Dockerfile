FROM node:20-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar yarn e dependências
RUN npm install -g yarn
RUN yarn cache clean
RUN yarn install --production --ignore-engines
RUN yarn cache clean

# Copiar código fonte
COPY . .

# Buildar aplicação
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Instalar yarn e dependências de produção
COPY package*.json ./
RUN npm install -g yarn
RUN yarn cache clean
RUN yarn install --production --ignore-engines

# Copiar build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Criar diretórios necessários
RUN mkdir -p logs uploads

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Permissões
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start command
CMD ["node", "dist/server.js"]
