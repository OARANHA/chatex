import { AxiosInstance } from 'axios';
import { ApiResponse, Message, MessageContent } from '../types';
import { ContactsContent, FileContent, LocationContent, TemplateContent, TextContent } from '../types/Content';
import { BaseChannel } from './BaseChannel';

export class WhatsAppChannel extends BaseChannel {
  private phoneNumberId: string;
  private accessToken: string;
  private apiVersion: string;

  constructor(httpClient: AxiosInstance) {
    super(httpClient, 'whatsapp');
    
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.apiVersion = process.env.WHATSAPP_VERSION || 'v18.0';
    
    if (!this.phoneNumberId || !this.accessToken) {
      throw new Error('WhatsApp Channel: PHONE_NUMBER_ID and ACCESS_TOKEN environment variables are required');
    }
  }

  async sendMessage(from: string, to: string, content: MessageContent): Promise<ApiResponse<Message>> {
    this.validateMessage(from, to, content);
    this.logOperation('sendMessage', from, to, content.type);

    try {
      const payload = this.buildMessagePayload(to, content);
      
      const response = await this.retryOperation(async () => {
        return this.httpClient.post(
          `/${this.apiVersion}/${this.phoneNumberId}/messages`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        );
      });

      const message: Message = {
        id: response.data.messages[0].id,
        from: from,
        to: to,
        content: content,
        timestamp: new Date(),
        status: { id: response.data.messages[0].id, status: 'sent', timestamp: new Date() },
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

  private buildMessagePayload(to: string, content: MessageContent): any {
    const basePayload = {
      messaging_product: 'whatsapp',
      to: this.formatPhoneNumber(to),
      recipient_type: 'individual'
    };

    switch (content.type) {
      case 'text':
        return {
          ...basePayload,
          type: 'text',
          text: {
            body: (content as TextContent).body
          }
        };

      case 'file':
        const fileContent = content as FileContent;
        return {
          ...basePayload,
          type: fileContent.mimeType.startsWith('image') ? 'image' :
                 fileContent.mimeType.startsWith('video') ? 'video' :
                 fileContent.mimeType.startsWith('audio') ? 'audio' : 'document',
          [fileContent.mimeType.startsWith('image') ? 'image' :
           fileContent.mimeType.startsWith('video') ? 'video' :
           fileContent.mimeType.startsWith('audio') ? 'audio' : 'document']: {
            link: fileContent.url,
            caption: fileContent.caption
          }
        };

      case 'location':
        const locationContent = content as LocationContent;
        return {
          ...basePayload,
          type: 'location',
          location: {
            latitude: locationContent.latitude,
            longitude: locationContent.longitude,
            name: locationContent.name,
            address: locationContent.address
          }
        };

      case 'contacts':
        const contactsContent = content as ContactsContent;
        return {
          ...basePayload,
          type: 'contacts',
          contacts: contactsContent.contacts
        };

      case 'template':
        const templateContent = content as TemplateContent;
        return {
          ...basePayload,
          type: 'template',
          template: {
            name: templateContent.templateName,
            language: {
              code: templateContent.language || 'pt_BR'
            },
            components: [{
              type: 'body',
              parameters: templateContent.templateData.map((value: any) => ({
                type: 'text',
                text: String(value)
              }))
            }]
          }
        };

      default:
        throw new Error(`WhatsApp Channel: Content type '${content.type}' not supported`);
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove caracteres não numéricos e adicionar código do país se necessário
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('55')) {
      return cleaned + '@c.us'; // Formato WhatsApp Brasil
    }
    
    if (cleaned.length === 10) {
      return '55' + cleaned + '@c.us'; // Adicionar código do Brasil
    }
    
    return cleaned + '@c.us';
  }

  // Método para verificar status do número
  async verifyPhoneNumber(phoneNumberId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.httpClient.get(
        `/${this.apiVersion}/${phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      throw this.handleError(error, 'verifyPhoneNumber');
    }
  }

  // Método para listar templates disponíveis
  async listTemplates(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.httpClient.get(
        `/${this.apiVersion}/${this.phoneNumberId}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data || []
      };

    } catch (error) {
      throw this.handleError(error, 'listTemplates');
    }
  }

  // Método para configurar webhook
  async setWebhook(webhookUrl: string, verifyToken?: string): Promise<ApiResponse<any>> {
    try {
      const payload = {
        id: this.phoneNumberId,
        webhook_url: webhookUrl,
        verify_token: verifyToken || '28web_verify_token',
        fields: ['messages', 'message_status', 'contacts']
      };

      const response = await this.httpClient.post(
        `/${this.apiVersion}/${this.phoneNumberId}/webhooks`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      throw this.handleError(error, 'setWebhook');
    }
  }
}