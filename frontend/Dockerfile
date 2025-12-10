FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Buildar aplicação
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copiar build para nginx (Quasar PWA gera em /dist/pwa)
COPY --from=builder /app/dist/pwa /usr/share/nginx/html

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretório para logs
RUN mkdir -p /var/log/nginx

# Permissões
RUN chown -R nginx:nginx /usr/share/nginx/html /var/log/nginx

# Expor porta
EXPOSE 80

# Health check removido temporariamente para debug
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start command
CMD ["nginx", "-g", "daemon off;"]