import { MessageContent } from './index';

// Text Content
export class TextContent implements MessageContent {
  type: 'text' = 'text';
  
  constructor(public body: string) {}
}

// File Content
export class FileContent implements MessageContent {
  type: 'file' = 'file';
  
  constructor(
    public url: string,
    public mimeType: string,
    public caption?: string,
    public filename?: string
  ) {}
}

// Location Content
export class LocationContent implements MessageContent {
  type: 'location' = 'location';
  
  constructor(
    public latitude: number,
    public longitude: number,
    public name?: string,
    public address?: string
  ) {}
}

// Contacts Content
export class ContactsContent implements MessageContent {
  type: 'contacts' = 'contacts';
  
  constructor(public contacts: Contact[]) {}
}

export interface Contact {
  name: {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
  };
  phones?: Array<{
    phone: string;
    wa_id: string;
    type: string;
  }>;
  emails?: Array<{
    email: string;
    type: string;
  }>;
}

// Template Content
export class TemplateContent implements MessageContent {
  type: 'template' = 'template';
  
  constructor(
    public templateName: string,
    public templateData: any[],
    public language?: string
  ) {}
}

// Replyable Text Content
export class ReplyableTextContent implements MessageContent {
  type: 'text' = 'text';
  
  constructor(
    public body: string,
    public replyMessageId?: string
  ) {}
}