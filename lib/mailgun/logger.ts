/**
 * Structured Logger for Transactional Email Events
 * Provides consistent formatting, timing metrics, and safe email masking.
 */

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogPayload {
  level: LogLevel;
  event: string;
  recipient?: string | string[];
  subject?: string;
  messageId?: string;
  durationMs?: number;
  error?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Partially masks an email address for privacy in logs (e.g. j***e@domain.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

export function maskRecipients(recipients: string | string[]): string {
  if (Array.isArray(recipients)) {
    return recipients.map(maskEmail).join(", ");
  }
  return maskEmail(recipients);
}

class MailgunLogger {
  private formatLog(payload: LogPayload): string {
    const parts = [
      `[MAILGUN]`,
      `[${payload.level}]`,
      `[${payload.event}]`,
    ];

    if (payload.recipient) {
      parts.push(`to=${maskRecipients(payload.recipient)}`);
    }

    if (payload.subject) {
      parts.push(`subject="${payload.subject}"`);
    }

    if (payload.messageId) {
      parts.push(`id=${payload.messageId}`);
    }

    if (payload.durationMs !== undefined) {
      parts.push(`took=${payload.durationMs}ms`);
    }

    if (payload.error) {
      parts.push(`error="${payload.error}"`);
    }

    if (payload.details && Object.keys(payload.details).length > 0) {
      parts.push(`details=${JSON.stringify(payload.details)}`);
    }

    return parts.join(" ");
  }

  info(event: string, meta: Omit<Partial<LogPayload>, "level" | "event" | "timestamp"> = {}) {
    const payload: LogPayload = {
      level: "INFO",
      event,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.log(this.formatLog(payload));
  }

  warn(event: string, meta: Omit<Partial<LogPayload>, "level" | "event" | "timestamp"> = {}) {
    const payload: LogPayload = {
      level: "WARN",
      event,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.warn(this.formatLog(payload));
  }

  error(event: string, meta: Omit<Partial<LogPayload>, "level" | "event" | "timestamp"> = {}) {
    const payload: LogPayload = {
      level: "ERROR",
      event,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    console.error(this.formatLog(payload));
  }

  debug(event: string, meta: Omit<Partial<LogPayload>, "level" | "event" | "timestamp"> = {}) {
    if (process.env.NODE_ENV !== "production") {
      const payload: LogPayload = {
        level: "DEBUG",
        event,
        timestamp: new Date().toISOString(),
        ...meta,
      };
      console.debug(this.formatLog(payload));
    }
  }
}

export const emailLogger = new MailgunLogger();
