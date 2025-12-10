import { AxiosInstance } from 'axios';
import { ApiResponse, Message, MessageContent } from '../types';
import { FileContent, TextContent } from '../types/Content';
import { BaseChannel } from './BaseChannel';

export class TelegramChannel extends BaseChannel {
  private botToken: string;

  constructor(httpClient: AxiosInstance) {
    super(httpClient, 'telegram');
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    
    if (!this.botToken) {
      throw new Error('Telegram Channel: TELEGRAM_BOT_TOKEN environment variable is required');
    }
  }

  async sendMessage(from: string, to: string, content: MessageContent): Promise<ApiResponse<Message>> {
    this.validateMessage(from, to, content);
    this.logOperation('sendMessage', from, to, content.type);

    try {
      // Implementação usando Telegram Bot API
      const payload = this.buildTelegramPayload(to, content);
      
      const response = await this.retryOperation(async () => {
        return this.httpClient.post(
          `https://api.telegram.org/bot${this.botToken}/sendMessage`,
          payload
        );
      });

      const message: Message = {
        id: response.data.result.message_id.toString(),
        from: from,
        to: to,
        content: content,
        timestamp: new Date(),
        status: { id: response.data.result.message_id.toString(), status: 'sent', timestamp: new Date() },
        channel: this.channelType
      };

      return {
        success: true,
        data: message
      };

    } catch (error) {
      throw this.handleError(error, 'sendMessage');
    }
  }

  private buildTelegramPayload(to: string, content: MessageContent): any {
    const basePayload = {
      chat_id: to
    };

    switch (content.type) {
      case 'text':
        return {
          ...basePayload,
          text: (content as TextContent).body
        };

      case 'file':
        const fileContent = content as FileContent;
        if (fileContent.mimeType.startsWith('image')) {
          return {
            ...basePayload,
            photo: fileContent.url,
            caption: fileContent.caption
          };
        } else if (fileContent.mimeType.startsWith('video')) {
          return {
            ...basePayload,
            video: fileContent.url,
            caption: fileContent.caption
          };
        } else if (fileContent.mimeType.startsWith('audio')) {
          return {
            ...basePayload,
            audio: fileContent.url,
            caption: fileContent.caption
          };
        } else {
          return {
            ...basePayload,
            document: fileContent.url,
            caption: fileContent.caption
          };
        }

      default:
        throw new Error(`Telegram Channel: Content type '${content.type}' not supported`);
    }
  }

  // Método para verificar informações do bot
  async getBotInfo(): Promise<ApiResponse<any>> {
    try {
      const response = await this.httpClient.get(
        `https://api.telegram.org/bot${this.botToken}/getMe`
      );

      return {
        success: true,
        data: response.data.result
      };

    } catch (error) {
      throw this.handleError(error, 'getBotInfo');
    }
  }

  // Método para configurar webhook
  async setWebhook(webhookUrl: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.httpClient.post(
        `https://api.telegram.org/bot${this.botToken}/setWebhook`,
        {
          url: webhookUrl
        }
      );

      return {
        success: true,
        data: response.data.result
      };

    } catch (error) {
      throw this.handleError(error, 'setWebhook');
    }
  }
}