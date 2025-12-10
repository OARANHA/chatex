// Exemplo de uso do SDK 28web
// Substituto direto do notificamehubsdk

import { FileContent, Hub28webClient, TextContent, WebhookController } from '../index';

async function main() {
  // 1. Inicializar o cliente
  const client = new Hub28webClient('seu-api-token-aqui');

  try {
    // 2. Enviar mensagem de texto via WhatsApp
    const whatsapp = client.setChannel('whatsapp');
    const textContent = new TextContent('Olá! Esta é uma mensagem do SDK 28web 🚀');
    
    const textResult = await whatsapp.sendMessage('5511999998888', '5511988887777', textContent);
    console.log('Mensagem de texto enviada:', textResult);

    // 3. Enviar imagem via WhatsApp
    const imageContent = new FileContent(
      'https://exemplo.com/imagem.jpg',
      'image',
      'Confira nossa promoção!'
    );
    
    const imageResult = await whatsapp.sendMessage('5511999998888', '5511988887777', imageContent);
    console.log('Imagem enviada:', imageResult);

    // 4. Enviar mensagem via Facebook
    const facebook = client.setChannel('facebook');
    const fbResult = await facebook.sendMessage('page_id', 'user_id', textContent);
    console.log('Mensagem Facebook enviada:', fbResult);

    // 5. Enviar mensagem via Instagram
    const instagram = client.setChannel('instagram');
    const igResult = await instagram.sendMessage('ig_business_id', 'user_id', textContent);
    console.log('Mensagem Instagram enviada:', igResult);

    // 6. Enviar mensagem via Telegram
    const telegram = client.setChannel('telegram');
    const tgResult = await telegram.sendMessage('bot_id', 'chat_id', textContent);
    console.log('Mensagem Telegram enviada:', tgResult);

    // 7. Listar canais disponíveis
    const channels = await client.getChannels();
    console.log('Canais disponíveis:', channels);

    // 8. Verificar status do SDK
    const status = await client.getStatus();
    console.log('Status do SDK:', status);

  } catch (error) {
    console.error('Erro:', error.message);
  }
}

// Exemplo de configuração de webhook
function setupWebhook() {
  const webhook = new WebhookController({
    port: 3000,
    path: '/webhook',
    verifyToken: 'seu_verify_token_secreto',
    messageEventHandler: (event) => {
      console.log('Nova mensagem recebida:', event);
      // Processar mensagem aqui
    },
    messageStatusEventHandler: (event) => {
      console.log('Status da mensagem atualizado:', event);
      // Processar status aqui
    }
  });

  webhook.init();
}

// Exemplo de compatibilidade com notificamehubsdk
async function legacyCompatibility() {
  // Código antigo com notificamehubsdk:
  // const { Client, TextContent } = require('notificamehubsdk');
  // const client = new Client('YOUR_API_TOKEN');
  // const whatsapp = client.setChannel('whatsapp');
  // const content = new TextContent('Some text message');
  // whatsapp.sendMessage('sender', 'recipient', content);

  // Novo código com SDK 28web (compatível):
  const { Client, TextContent } = require('../index');
  const client = new Client('seu-api-token-aqui');
  const whatsapp = client.setChannel('whatsapp');
  const content = new TextContent('Some text message');
  whatsapp.sendMessage('sender', 'recipient', content);
}

// Executar exemplos
if (require.main === module) {
  main();
  setupWebhook();
}

export { legacyCompatibility, main, setupWebhook };
