import { AxiosInstance } from 'axios';
import { ApiResponse, Message, MessageContent } from '../types';
import { FileContent, TextContent } from '../types/Content';
import { BaseChannel } from './BaseChannel';

export class FacebookChannel extends BaseChannel {
  constructor(httpClient: AxiosInstance) {
    super(httpClient, 'facebook');
  }

  async sendMessage(from: string, to: string, content: MessageContent): Promise<ApiResponse<Message>> {
    this.validateMessage(from, to, content);
    this.logOperation('sendMessage', from, to, content.type);

    try {
      // Implementação usando Facebook Graph API
      const payload = this.buildFacebookPayload(to, content);
      
      const response = await this.retryOperation(async () => {
        return this.httpClient.post(`/facebook/messages`, payload);
      });

      const message: Message = {
        id: response.data.message_id,
        from: from,
        to: to,
        content: content,
        timestamp: new Date(),
        status: { id: response.data.message_id, status: 'sent', timestamp: new Date() },
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

  private buildFacebookPayload(to: string, content: MessageContent): any {
    const basePayload = {
      recipient: { id: to },
      messaging_type: 'RESPONSE'
    };

    switch (content.type) {
      case 'text':
        return {
          ...basePayload,
          message: {
            text: (content as TextContent).body
          }
        };

      case 'file':
        const fileContent = content as FileContent;
        return {
          ...basePayload,
          message: {
            attachment: {
              type: fileContent.mimeType.startsWith('image') ? 'image' : 'file',
              payload: {
                url: fileContent.url,
                is_reusable: true
              }
            }
          }
        };

      default:
        throw new Error(`Facebook Channel: Content type '${content.type}' not supported`);
    }
  }
}