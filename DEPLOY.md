# 🚀 Deploy Chatex no Docker Swarm

## 📋 Pré-requisitos
- Docker Swarm ativo
- Traefik configurado
- Domínios apontados para VPS

## 🔧 Passo a Passo

### 1. Build das Imagens
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 2. Deploy no Portainer
1. Acessar Portainer
2. Stacks → Add stack
3. Name: `chatex`
4. Colar conteúdo do `docker-compose.swarm.yml`
5. Deploy the stack

### 3. Configurar Variáveis
Copie `.env.example` para `.env` e configure:
- JWT secrets (gere com `openssl rand -base64 32`)
- Credenciais WhatsApp/Facebook/Telegram

## 🌐 Acessos
- Backend: https://chatexend.28web.com.br
- Frontend: https://chatex.28web.com.br
- Traefik: https://traefik.28web.com.br

## 📊 Verificação
```bash
docker stack services chatex
docker stack ps chatex