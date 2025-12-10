import { AxiosInstance } from 'axios';
import { logger } from '../../../utils/logger';
import { ApiResponse, Message, MessageContent } from '../types';

export abstract class BaseChannel {
  protected httpClient: AxiosInstance;
  protected channelType: string;

  constructor(httpClient: AxiosInstance, channelType: string) {
    this.httpClient = httpClient;
    this.channelType = channelType;
  }

  // Método abstrato que deve ser implementado por cada canal
  abstract sendMessage(from: string, to: string, content: MessageContent): Promise<ApiResponse<Message>>;

  // Método comum para tratamento de erros
  protected handleError(error: any, operation: string): Error {
    logger.error(`[${this.channelType}] Error in ${operation}:`, error);
    
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error || data?.message || `HTTP ${status}`;
      return new Error(`${this.channelType} API Error (${operation}): ${message}`);
    } else if (error.request) {
      return new Error(`${this.channelType} API: No response received in ${operation}`);
    } else {
      return new Error(`${this.channelType} SDK (${operation}): ${error.message}`);
    }
  }

  // Método comum para validação
  protected validateMessage(from: string, to: string, content: MessageContent): void {
    if (!from || !to) {
      throw new Error(`${this.channelType}: From and To parameters are required`);
    }
    
    if (!content) {
      throw new Error(`${this.channelType}: Content is required`);
    }

    if (!content.type) {
      throw new Error(`${this.channelType}: Content type is required`);
    }
  }

  // Método comum para logging
  protected logOperation(operation: string, from: string, to: string, contentType: string): void {
    logger.info(`[${this.channelType}] ${operation}: ${from} -> ${to} (${contentType})`);
  }

  // Método para retry automático
  protected async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        logger.warn(`[${this.channelType}] Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await this.sleep(delay * attempt); // Exponential backoff
      }
    }
    
    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Getter para o tipo de canal
  public getChannelType(): string {
    return this.channelType;
  }
}