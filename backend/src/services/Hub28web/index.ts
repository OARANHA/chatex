// SDK 28web - Hub de Comunicação Multicanal
// Substituto do notificamehubsdk com controle total

export { FacebookChannel } from './channels/FacebookChannel';
export { InstagramChannel } from './channels/InstagramChannel';
export { TelegramChannel } from './channels/TelegramChannel';
export { WhatsAppChannel } from './channels/WhatsAppChannel';
export { Hub28webClient } from './Hub28webClient';

// Content Types
export { ContactsContent, FileContent, LocationContent, TemplateContent, TextContent } from './types/Content';

// Webhook
export { WebhookController } from './webhook/WebhookController';

// MessageSubscription class for compatibility
export { MessageSubscription } from './MessageSubscription';

// Types
export * from './types';

// Legacy compatibility - Export como Client para substituição direta
export { Hub28webClient as Client } from './Hub28webClient';

