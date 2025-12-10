// Classe MessageSubscription para compatibilidade com notificamehubsdk
import { Subscription } from './types';

export class MessageSubscription implements Subscription {
  id: string;
  url: string;
  channel: string;
  events: string[];
  active: boolean;

  constructor(config: { url: string }, options?: { channel?: string; events?: string[] }) {
    this.id = Math.random().toString(36).substr(2, 9); // ID temporário
    this.url = config.url;
    this.channel = options?.channel || 'whatsapp';
    this.events = options?.events || ['message', 'message_status'];
    this.active = true;
  }
}