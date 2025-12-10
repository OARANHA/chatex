# Chatex - Plataforma de Comunicação Multicanal

## 🎯 Sobre

Plataforma SaaS para gestão de atendimento multicanal com SDK próprio e integrações oficiais.

## 🚀 Tecnologias

- **Backend**: Node.js + TypeScript + PostgreSQL + Redis
- **Frontend**: Vue.js + Quasar Framework
- **SDK**: 28web SDK (WhatsApp Cloud API, Facebook, Instagram, Telegram)
- **Infraestrutura**: Docker + Nginx + PM2

## 📱 Canais Suportados

- ✅ WhatsApp Cloud API
- ✅ Facebook Messenger
- ✅ Instagram Direct
- ✅ Telegram Bot

## 🏗️ Arquitetura

- **SDK 28web**: Próprio, substituindo notificamehubsdk
- **Multiempresas**: Arquitetura SaaS completa
- **API REST**: Backend robusto e escalável
- **Interface Moderna**: UX/UI profissional

## 🌐 Deploy

- **Backend**: `chatexend.28web.com.br`
- **Frontend**: `chatex.28web.com.br`
- **Infraestrutura**: Docker containers

## 📦 Estrutura do Projeto

```
chatex/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── services/
│   │   │   └── Hub28web/   # SDK 28web próprio
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── dist/               # Build compilado
│   └── package.json
├── frontend/               # Vue.js + Quasar
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── layouts/
│   ├── dist/pwa/           # Build compilado
│   └── package.json
├── docs/                   # Documentação
├── docker-compose.yml      # Configuração Docker
└── README.md
```

## 🔧 SDK 28web

Nosso SDK próprio para comunicação multicanal:

### 📱 WhatsApp Cloud API
- Integração oficial com Meta
- Templates de mensagem
- Status de entrega em tempo real
- Suporte a mídias

### 💬 Facebook Messenger
- API Graph do Facebook
- Webhooks para mensagens
- Botões e quick replies

### 📷 Instagram Direct
- API Graph do Instagram
- Mensagens privadas
- Mídia e stories

### 🤖 Telegram Bot
- Telegram Bot API
- Comandos e inline queries
- Grupos e canais

## 🚀 Instalação Local

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (opcional)

### Backend
```bash
cd backend
npm install
npm run build
npm run dev:server
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker

### Subir containers
```bash
docker-compose up -d
```

### Parar containers
```bash
docker-compose down
```

## 🌐 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=chatex
POSTGRES_PASSWORD=chatex@2024
POSTGRES_DB=chatex
IO_REDIS_SERVER=localhost
IO_REDIS_PORT=6379
IO_REDIS_PASSWORD=chatex@2024
BACKEND_URL=http://localhost:3100
FRONTEND_URL=http://localhost:3003
JWT_SECRET=seu_jwt_secret
JWT_REFRESH_SECRET=seu_jwt_refresh_secret
```

### Frontend (.env)
```env
VUE_URL_API=http://localhost:3100
VUE_FACEBOOK_APP_ID=sua_app_id
```

## 📊 Monitoramento

- **PM2**: Gerenciamento de processos
- **Logs**: Estruturados e centralizados
- **Health Checks**: Endpoints de verificação
- **Métricas**: Performance e uso

## 🔐 Segurança

- **JWT**: Autenticação com tokens
- **Rate Limiting**: Proteção contra abuso
- **CORS**: Configuração segura
- **Input Validation**: Validação de dados
- **SQL Injection**: Proteção com ORM

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test:unit
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

AGPL-3.0 - Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Desenvolvimento

Desenvolvido por 28web com SDK próprio e integrações oficiais.

### Contato
- **Website**: https://28web.com.br
- **Email**: contato@28web.com.br

---

**Chatex** - Comunicação multicanal simplificada com poder do SDK próprio! 🚀
