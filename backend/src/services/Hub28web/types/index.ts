// Tipos principais do SDK 28web

export interface Message {
  id: string;
  from: string;
  to: string;
  content: MessageContent;
  timestamp: Date;
  status: MessageStatus;
  channel: string;
}

export interface MessageContent {
  type: 'text' | 'file' | 'location' | 'contacts' | 'template';
}

export interface MessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  error?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'connecting';
  config: ChannelConfig;
}

export interface ChannelConfig {
  [key: string]: any;
}

export interface WebhookEvent {
  event: 'message' | 'message_status';
  data: any;
  channel: string;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface Subscription {
  id: string;
  url: string;
  channel: string;
  events: string[];
  active: boolean;
}