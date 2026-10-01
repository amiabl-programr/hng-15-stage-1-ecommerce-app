import FormData from "form-data";
import Mailgun from "mailgun.js";
import { MailgunConfig } from "./types";
import { emailLogger } from "./logger";

let cachedClient: ReturnType<InstanceType<typeof Mailgun>["client"]> | null = null;
let cachedConfig: MailgunConfig | null = null;

export function getMailgunConfig(): MailgunConfig | null {
  const apiKey = process.env.MAILGUN_API_KEY?.trim();
  const domain = process.env.MAILGUN_DOMAIN?.trim();
  let fromEmail = process.env.MAILGUN_FROM_EMAIL?.trim();

  if (!apiKey || !domain) {
    return null;
  }

  // If using Mailgun sandbox domain, ensure from address matches the sandbox domain
  // unless explicitly specified with a valid address
  if (domain.startsWith("sandbox") && domain.includes(".mailgun.org")) {
    if (!fromEmail || fromEmail.includes("yourdomain.com") || fromEmail.includes("example.com")) {
      fromEmail = `Roofing Construction Shop <postmaster@${domain}>`;
      emailLogger.debug("CONFIG_RESOLVE", {
        details: { notice: "Sandbox domain detected. Sender formatted to sandbox postmaster.", fromEmail },
      });
    }
  }

  if (!fromEmail) {
    fromEmail = `Roofing Construction Shop <orders@${domain}>`;
  }

  return {
    apiKey,
    domain,
    fromEmail,
    url: process.env.MAILGUN_URL || (domain.endsWith(".eu") ? "https://api.eu.mailgun.net" : undefined),
  };
}

export function getMailgunClient(): {
  client: ReturnType<InstanceType<typeof Mailgun>["client"]>;
  config: MailgunConfig;
} | null {
  const config = getMailgunConfig();

  if (!config) {
    return null;
  }

  if (cachedClient && cachedConfig && cachedConfig.apiKey === config.apiKey && cachedConfig.domain === config.domain) {
    return { client: cachedClient, config: cachedConfig };
  }

  try {
    const mailgun = new Mailgun(FormData);
    const clientOptions: { username: string; key: string; url?: string } = {
      username: "api",
      key: config.apiKey,
    };

    if (config.url) {
      clientOptions.url = config.url;
    }

    cachedClient = mailgun.client(clientOptions);
    cachedConfig = config;

    emailLogger.info("CLIENT_INIT", {
      details: {
        domain: config.domain,
        sender: config.fromEmail,
        isCustomEndpoint: !!config.url,
      },
    });

    return { client: cachedClient, config };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emailLogger.error("CLIENT_INIT_FAILED", { error: message });
    return null;
  }
}
