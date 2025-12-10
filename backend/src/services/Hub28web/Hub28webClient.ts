import axios, { AxiosInstance } from 'axios';
import { logger } from '../../utils/logger';
import { BaseChannel } from './channels/BaseChannel';
import { FacebookChannel } from './channels/FacebookChannel';
import { InstagramChannel } from './channels/InstagramChannel';
import { TelegramChannel } from './channels/TelegramChannel';
import { WhatsAppChannel } from './channels/WhatsAppChannel';
import { ApiResponse, Channel, Subscription } from './types';

export class Hub28webClient {
  private token: string;
  private httpClient: AxiosInstance;
  private channels: Map<string, BaseChannel> = new Map();

  constructor(token: string, baseUrl?: string) {
    this.token = token;
    
    this.httpClient = axios.create({
      baseURL: baseUrl || process.env.HUB28WEB_API_BASE_URL || 'https://api.28web.io',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': '28web-SDK/1.0.0'
      },
      timeout: parseInt(process.env.HUB28WEB_TIMEOUT || '30000')
    });

    this.setupInterceptors();
    this.initializeChannels();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      (config) => {
        logger.debug(`[Hub28web] Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('[Hub28web] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.httpClient.interceptors.response.use(
      (response) => {
        logger.debug(`[Hub28web] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('[Hub28web] Response error:', error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private initializeChannels(): void {
    // Inicializar canais disponíveis
    this.channels.set('whatsapp', new WhatsAppChannel(this.httpClient));
    this.channels.set('facebook', new FacebookChannel(this.httpClient));
    this.channels.set('instagram', new InstagramChannel(this.httpClient));
    this.channels.set('telegram', new TelegramChannel(this.httpClient));
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error || data?.message || `HTTP ${status}`;
      return new Error(`Hub28web API Error: ${message}`);
    } else if (error.request) {
      return new Error('Hub28web API: No response received');
    } else {
      return new Error(`Hub28web SDK: ${error.message}`);
    }
  }

  // Método principal para definir canal
  public setChannel(channelType: string): BaseChannel {
    const channel = this.channels.get(channelType);
    if (!channel) {
      throw new Error(`Channel '${channelType}' not supported. Available channels: ${Array.from(this.channels.keys()).join(', ')}`);
    }
    return channel;
  }

  // Listar canais disponíveis
  public async getChannels(): Promise<Channel[]> {
    try {
      const response = await this.httpClient.get('/channels');
      return response.data;
    } catch (error) {
      logger.error('[Hub28web] Error getting channels:', error);
      throw error;
    }
  }

  // Criar subscription para webhooks
  public async createSubscription(subscription: Omit<Subscription, 'id' | 'active'>): Promise<Subscription> {
    try {
      const response = await this.httpClient.post('/subscriptions', subscription);
      return response.data;
    } catch (error) {
      logger.error('[Hub28web] Error creating subscription:', error);
      throw error;
    }
  }

  // Listar subscriptions
  public async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await this.httpClient.get('/subscriptions');
      return response.data;
    } catch (error) {
      logger.error('[Hub28web] Error getting subscriptions:', error);
      throw error;
    }
  }

  // Deletar subscription
  public async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.httpClient.delete(`/subscriptions/${subscriptionId}`);
    } catch (error) {
      logger.error('[Hub28web] Error deleting subscription:', error);
      throw error;
    }
  }

  // Verificar status do SDK
  public async getStatus(): Promise<ApiResponse<{ status: string; version: string }>> {
    try {
      const response = await this.httpClient.get('/status');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Método para compatibilidade legada (alias)
  public static async create(token: string, baseUrl?: string): Promise<Hub28webClient> {
    return new Hub28webClient(token, baseUrl);
  }
}

// Export para compatibilidade com notificamehubsdk
export { Hub28webClient as Client };
