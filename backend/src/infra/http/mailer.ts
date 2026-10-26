import nodemailer from "nodemailer";
import { config } from "../../app/config.js";
import { logger } from "../logger/logger.js";

type MailInput = {
  to: string;
  subject: string;
  text: string;
};

export const sendMail = async (input: MailInput) => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    logger.info({ to: input.to, subject: input.subject }, "SMTP is not configured; mail skipped");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: config.MAIL_FROM,
    to: input.to,
    subject: input.subject,
    text: input.text
  });
};
