FROM node:20-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm cache clean --force
RUN npm install --production --legacy-peer-deps --ignore-scripts --no-optional
RUN npm cache clean --force

# Copiar código fonte
COPY . .

# Buildar aplicação
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependências de produção
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --production --legacy-peer-deps --ignore-scripts --no-optional

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
