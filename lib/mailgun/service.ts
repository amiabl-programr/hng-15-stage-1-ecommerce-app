import { getMailgunClient } from "./client";
import { SendEmailOptions, EmailSendResult } from "./types";
import { emailLogger } from "./logger";

/**
 * Core Mailgun Email Transmission Service
 * Encapsulates client execution, execution timing, and structured logging.
 * Guarantees that failures are safely caught without interrupting core app workflows.
 */
export async function sendMail(options: SendEmailOptions): Promise<EmailSendResult> {
  const startTime = Date.now();
  const mgContext = getMailgunClient();

  if (!mgContext) {
    emailLogger.warn("SEND_SKIPPED", {
      subject: options.subject,
      recipient: options.to,
      details: {
        reason: "MAILGUN_API_KEY or MAILGUN_DOMAIN not configured in environment.",
      },
    });

    return {
      success: false,
      error: "Mailgun credentials not configured in environment.",
      durationMs: Date.now() - startTime,
    };
  }

  const { client, config } = mgContext;
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  emailLogger.info("SEND_DISPATCHING", {
    subject: options.subject,
    recipient: options.to,
    details: {
      domain: config.domain,
      recipientCount: recipients.length,
    },
  });

  try {
    const messageData: Record<string, unknown> = {
      from: config.fromEmail,
      to: recipients,
      subject: options.subject,
      html: options.html,
      text: options.text || options.subject,
    };

    if (options.replyTo) {
      messageData["h:Reply-To"] = options.replyTo;
    }

    if (options.tags && options.tags.length > 0) {
      messageData["o:tag"] = options.tags;
    }

    if (options.metadata) {
      for (const [k, v] of Object.entries(options.metadata)) {
        messageData[`v:${k}`] = String(v);
      }
    }

    const response = await client.messages.create(config.domain, messageData as any);
    const durationMs = Date.now() - startTime;

    emailLogger.info("SEND_SUCCESS", {
      subject: options.subject,
      recipient: options.to,
      messageId: response.id,
      durationMs,
      details: {
        status: response.status,
        message: response.message,
      },
    });

    return {
      success: true,
      messageId: response.id,
      status: response.status || 200,
      durationMs,
    };
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    const statusCode = (err as any)?.status || (err as any)?.statusCode;

    // Detect sandbox unapproved recipient error
    let troubleshootingHint: string | undefined;
    if (statusCode === 403 && config.domain.includes("sandbox")) {
      troubleshootingHint =
        "Mailgun Sandbox Domains can only send to Authorized Recipients added in your Mailgun Dashboard (Domains > Sandbox > Authorized Recipients).";
    }

    emailLogger.error("SEND_FAILED", {
      subject: options.subject,
      recipient: options.to,
      error: errorMessage,
      durationMs,
      details: {
        status: statusCode,
        domain: config.domain,
        hint: troubleshootingHint,
      },
    });

    return {
      success: false,
      error: "Failed to send email.",
      status: statusCode,
      durationMs,
    };
  }
}
