import crypto from 'crypto';
import { Request, Response } from 'express';
import { logger } from '../../../utils/logger';
import { WebhookEvent } from '../types';

export interface WebhookConfig {
  port?: number;
  path?: string;
  verifyToken?: string;
  messageEventHandler?: (event: WebhookEvent) => void;
  messageStatusEventHandler?: (event: WebhookEvent) => void;
}

export class WebhookController {
  private config: WebhookConfig;
  private server?: any;

  constructor(config: WebhookConfig) {
    this.config = {
      port: 3000,
      path: '/webhook',
      verifyToken: '28web_verify_token',
      ...config
    };
  }

  public init(): void {
    if (this.server) {
      logger.warn('[WebhookController] Server already initialized');
      return;
    }

    const express = require('express');
    const app = express();

    // Middleware para parse JSON
    app.use(express.json());

    // Webhook endpoint
    app.post(this.config.path!, (req: Request, res: Response) => {
      this.handleWebhook(req, res);
    });

    // Verification endpoint (para WhatsApp)
    app.get(this.config.path!, (req: Request, res: Response) => {
      this.handleVerification(req, res);
    });

    // Health check
    app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    this.server = app.listen(this.config.port, () => {
      logger.info(`[WebhookController] Server running on port ${this.config.port}`);
      logger.info(`[WebhookController] Webhook endpoint: ${this.config.path}`);
    });
  }

  private handleVerification(req: Request, res: Response): void {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && challenge) {
      if (token === this.config.verifyToken) {
        logger.info('[WebhookController] Webhook verified successfully');
        res.status(200).send(challenge);
      } else {
        logger.warn('[WebhookController] Webhook verification failed');
        res.status(403).send('Verification failed');
      }
    } else {
      res.status(400).send('Missing parameters');
    }
  }

  private handleWebhook(req: Request, res: Response): void {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const body = JSON.stringify(req.body);

      // Verificar assinatura do webhook (se disponível)
      if (signature && this.config.verifyToken) {
        const expectedSignature = 'sha256=' + crypto
          .createHmac('sha256', this.config.verifyToken)
          .update(body)
          .digest('hex');

        if (signature !== expectedSignature) {
          logger.warn('[WebhookController] Invalid webhook signature');
          res.status(403).send('Invalid signature');
          return;
        }
      }

      const { object, entry } = req.body;

      if (!object || !entry) {
        logger.warn('[WebhookController] Invalid webhook payload');
        res.status(400).send('Invalid payload');
        return;
      }

      // Processar cada entrada
      for (const entryItem of entry) {
        if (entryItem.changes) {
          for (const change of entryItem.changes) {
            this.processChange(change);
          }
        } else if (entryItem.messaging) {
          // Formato Facebook/Instagram
          this.processMessaging(entryItem.messaging);
        } else if (entryItem.message) {
          // Formato Telegram
          this.processTelegramMessage(entryItem);
        }
      }

      res.status(200).send('OK');

    } catch (error) {
      logger.error('[WebhookController] Error processing webhook:', error);
      res.status(500).send('Internal server error');
    }
  }

  private processChange(change: any): void {
    const { field, value } = change;

    if (field === 'messages') {
      // WhatsApp message
      const event: WebhookEvent = {
        event: 'message',
        data: value,
        channel: 'whatsapp',
        timestamp: new Date()
      };

      if (this.config.messageEventHandler) {
        this.config.messageEventHandler(event);
      }
    } else if (field === 'message_status') {
      // WhatsApp message status
      const event: WebhookEvent = {
        event: 'message_status',
        data: value,
        channel: 'whatsapp',
        timestamp: new Date()
      };

      if (this.config.messageStatusEventHandler) {
        this.config.messageStatusEventHandler(event);
      }
    }
  }

  private processMessaging(messaging: any[]): void {
    for (const message of messaging) {
      const event: WebhookEvent = {
        event: 'message',
        data: message,
        channel: message.sender.platform === 'instagram' ? 'instagram' : 'facebook',
        timestamp: new Date()
      };

      if (this.config.messageEventHandler) {
        this.config.messageEventHandler(event);
      }
    }
  }

  private processTelegramMessage(message: any): void {
    const event: WebhookEvent = {
      event: 'message',
      data: message,
      channel: 'telegram',
      timestamp: new Date()
    };

    if (this.config.messageEventHandler) {
      this.config.messageEventHandler(event);
    }
  }

  public stop(): void {
    if (this.server) {
      this.server.close(() => {
        logger.info('[WebhookController] Server stopped');
      });
      this.server = undefined;
    }
  }

  // Método estático para criação fácil
  public static create(config: WebhookConfig): WebhookController {
    return new WebhookController(config);
  }
}