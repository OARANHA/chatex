#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Deploy Chatex - Iniciando..."

# Variáveis
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Build das imagens Docker..."
docker build -t chatex-backend:latest ./backend
docker build -t chatex-frontend:latest ./frontend

echo "✅ Build concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Abra o Portainer"
echo "2. Vá em Stacks → Add stack"
echo "3. Cole o conteúdo do docker-compose.swarm.yml"
echo "4. Name: chatex"
echo "5. Deploy the stack"
echo ""
echo "🌐 Após deploy, acesse:"
echo "   - Backend: https://chatexend.28web.com.br"
echo "   - Frontend: https://chatex.28web.com.br"
echo "   - Traefik: https://traefik.28web.com.br"