# SDK 28web - Hub de Comunicação Multicanal

O SDK 28web é uma solução proprietária para comunicação multicanal que substitui o notificamehubsdk, oferecendo controle total e integração direta com APIs oficiais.

## 🚀 Características

- ✅ **WhatsApp Cloud API** - Integração direta com Meta
- ✅ **Facebook Graph API** - Messenger oficial
- ✅ **Instagram Graph API** - DM oficial
- ✅ **Telegram Bot API** - Bot oficial
- ✅ **Interface unificada** - Mesma API para todos os canais
- ✅ **Webhooks integrados** - Recebimento de mensagens em tempo real
- ✅ **Retry automático** - Tolerância a falhas
- ✅ **Logging estruturado** - Monitoramento completo
- ✅ **TypeScript** - Tipagem segura

## 📦 Instalação

```bash
npm install hub28web-sdk
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=seu_phone_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_VERSION=v18.0

# Telegram Bot API
TELEGRAM_BOT_TOKEN=seu_bot_token

# SDK 28web
HUB28WEB_API_BASE_URL=https://api.28web.io
HUB28WEB_TIMEOUT=30000
HUB28WEB_RETRY_ATTEMPTS=3
```

## 📖 Uso Básico

### Inicialização

```typescript
import { Hub28webClient, TextContent } from 'hub28web-sdk';

// Criar cliente
const client = new Hub28webClient('seu-api-token');
```

### Enviar Mensagem de Texto

```typescript
// WhatsApp
const whatsapp = client.setChannel('whatsapp');
const textContent = new TextContent('Olá! Como posso ajudar?');

const result = await whatsapp.sendMessage('remetente', 'destinatario', textContent);
console.log('Mensagem enviada:', result);
```

### Enviar Mídia

```typescript
import { FileContent } from 'hub28web-sdk';

const imageContent = new FileContent(
  'https://exemplo.com/imagem.jpg',
  'image',
  'Confira nossa promoção!'
);

await whatsapp.sendMessage('remetente', 'destinatario', imageContent);
```

### Múltiplos Canais

```typescript
// Facebook
const facebook = client.setChannel('facebook');
await facebook.sendMessage('page_id', 'user_id', textContent);

// Instagram
const instagram = client.setChannel('instagram');
await instagram.sendMessage('ig_business_id', 'user_id', textContent);

// Telegram
const telegram = client.setChannel('telegram');
await telegram.sendMessage('bot_id', 'chat_id', textContent);
```

## 🎯 Conteúdo de Mensagem

### Texto Simples

```typescript
const textContent = new TextContent('Sua mensagem aqui');
```

### Arquivos/Mídia

```typescript
const fileContent = new FileContent(
  'https://url-do-arquivo',
  'image', // 'image', 'video', 'audio', 'document'
  'Legenda opcional',
  'nome-do-arquivo.ext'
);
```

### Localização

```typescript
import { LocationContent } from 'hub28web-sdk';

const locationContent = new LocationContent(
  -23.5505, // latitude
  -46.6333, // longitude
  'São Paulo', // nome
  'Endereço completo' // endereço
);
```

### Contatos

```typescript
import { ContactsContent } from 'hub28web-sdk';

const contactsContent = new ContactsContent([
  {
    name: {
      formatted_name: 'João Silva',
      first_name: 'João',
      last_name: 'Silva'
    },
    phones: [
      {
        phone: '5511999998888',
        wa_id: '5511999998888',
        type: 'MOBILE'
      }
    ]
  }
]);
```

### Templates (WhatsApp)

```typescript
import { TemplateContent } from 'hub28web-sdk';

const templateContent = new TemplateContent(
  'nome_do_template',
  ['valor1', 'valor2'], // dados do template
  'pt_BR' // idioma
);
```

## 🔔 Webhooks

### Configuração Básica

```typescript
import { WebhookController } from 'hub28web-sdk';

const webhook = new WebhookController({
  port: 3000,
  path: '/webhook',
  verifyToken: 'seu_token_secreto',
  messageEventHandler: (event) => {
    console.log('Nova mensagem:', event);
    // Processar mensagem
  },
  messageStatusEventHandler: (event) => {
    console.log('Status atualizado:', event);
    // Processar status
  }
});

webhook.init();
```

### Eventos Recebidos

```typescript
// Evento de mensagem
{
  event: 'message',
  data: {
    id: 'msg_id',
    from: '5511999998888',
    to: '5511988887777',
    content: { type: 'text', body: 'Olá!' },
    timestamp: '2025-01-01T12:00:00Z'
  },
  channel: 'whatsapp',
  timestamp: new Date()
}

// Evento de status
{
  event: 'message_status',
  data: {
    id: 'msg_id',
    status: 'delivered',
    timestamp: '2025-01-01T12:01:00Z'
  },
  channel: 'whatsapp',
  timestamp: new Date()
}
```

## 🔄 Migração do notificamehubsdk

O SDK 28web é 100% compatível com a API do notificamehubsdk:

### Código Antigo

```javascript
const { Client, TextContent } = require('notificamehubsdk');
const client = new Client('YOUR_API_TOKEN');
const whatsapp = client.setChannel('whatsapp');
const content = new TextContent('Some text');
whatsapp.sendMessage('sender', 'recipient', content);
```

### Código Novo (Compatível)

```javascript
const { Client, TextContent } = require('hub28web-sdk');
const client = new Client('seu-api-token');
const whatsapp = client.setChannel('whatsapp');
const content = new TextContent('Some text');
whatsapp.sendMessage('sender', 'recipient', content);
```

## 📊 Canais Suportados

| Canal | Status | API Oficial | Recursos |
|-------|--------|------------|---------|
| WhatsApp | ✅ | Cloud API | Texto, Mídia, Localização, Contatos, Templates |
| Facebook | ✅ | Graph API | Texto, Mídia |
| Instagram | ✅ | Graph API | Texto, Mídia |
| Telegram | ✅ | Bot API | Texto, Mídia, Comandos |

## 🛠️ Métodos Disponíveis

### Hub28webClient

- `setChannel(channelType)` - Selecionar canal
- `getChannels()` - Listar canais
- `createSubscription()` - Criar webhook
- `getSubscriptions()` - Listar webhooks
- `deleteSubscription(id)` - Remover webhook
- `getStatus()` - Verificar status

### WhatsAppChannel

- `sendMessage(from, to, content)` - Enviar mensagem
- `verifyPhoneNumber(id)` - Verificar número
- `listTemplates()` - Listar templates
- `setWebhook(url, token)` - Configurar webhook

### TelegramChannel

- `sendMessage(from, to, content)` - Enviar mensagem
- `getBotInfo()` - Informações do bot
- `setWebhook(url)` - Configurar webhook

## 🔒 Segurança

- Tokens de API criptografados
- Verificação de assinatura de webhook
- Rate limiting automático
- Retry com backoff exponencial
- Logging de erros detalhado

## 📈 Performance

- Conexões reutilizáveis
- Cache inteligente
- Timeout configurável
- Monitoramento em tempo real
- Métricas por canal

## 🐛 Troubleshooting

### Erros Comuns

1. **Token inválido**
   ```
   Error: Hub28web API Error: Invalid token
   ```
   - Verifique se o token está correto
   - Confirme as variáveis de ambiente

2. **Canal não suportado**
   ```
   Error: Channel 'xyz' not supported
   ```
   - Use canais disponíveis: whatsapp, facebook, instagram, telegram

3. **Webhook não verificado**
   ```
   Error: Webhook verification failed
   ```
   - Verifique o verify_token
   - Confirme a URL do webhook

### Debug Mode

```typescript
// Ativar logging detalhado
process.env.DEBUG = 'hub28web';

// Verificar status
const status = await client.getStatus();
console.log('Status:', status);
```

## 📝 Licença

MIT License - Copyright © 2025 28web

## 🤝 Suporte

- Documentação: https://docs.28web.io
- Issues: https://github.com/28web/sdk/issues
- Email: suporte@28web.io