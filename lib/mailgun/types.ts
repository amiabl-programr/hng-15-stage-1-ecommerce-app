import { Order, OrderItem, FabricationRequest, OrderStatus } from "@/types/database";

export interface MailgunConfig {
  apiKey: string;
  domain: string;
  fromEmail: string;
  url?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: string[];
  metadata?: Record<string, string | number | boolean>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  status?: number;
  error?: string;
  durationMs?: number;
}

export interface OrderEmailContext {
  order: Order;
  items: OrderItem[];
}

export interface FabricationEmailContext {
  request: FabricationRequest;
}

export interface OrderStatusEmailContext {
  order: Order;
  newStatus: OrderStatus;
  notes?: string;
}
