import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/app-error.js";
import { config } from "../../app/config.js";
import type { CreateInquiryInput } from "./inquiry.schema.js";

const sendMail = async (to: string, subject: string, text: string) => {
  if (!config.SMTP_HOST || !config.SMTP_USER) return; // silently skip if not configured
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    auth: { user: config.SMTP_USER, pass: config.SMTP_PASS }
  });
  await transporter.sendMail({ from: config.MAIL_FROM, to, subject, text });
};

export const inquiryService = {
  create: async (propertyId: string, input: CreateInquiryInput, studentId?: string) => {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, status: "APPROVED", isActive: true },
      include: { owner: { include: { user: { select: { email: true, name: true } } } } }
    });
    if (!property) throw new AppError(404, "Property not found");

    const inquiry = await prisma.propertyInquiry.create({
      data: { propertyId, studentId: studentId ?? null, ...input }
    });

    const ownerEmail = property.owner.user.email;
    const subject = `New inquiry for ${property.name} — NearStay`;
    const text = [
      `You have a new inquiry for your property: ${property.name}`,
      ``,
      `From: ${input.name} <${input.email}>`,
      input.phone ? `Phone: ${input.phone}` : "",
      ``,
      input.message ? `Message: ${input.message}` : "No message provided.",
      ``,
      `Login to NearStay to respond.`
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    await sendMail(ownerEmail, subject, text);

    return inquiry;
  },

  ownerList: async (userId: string) => {
    const owner = await prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner) throw new AppError(403, "Owner profile required");
    return prisma.propertyInquiry.findMany({
      where: { property: { ownerId: owner.id } },
      include: { property: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" }
    });
  },

  adminList: () =>
    prisma.propertyInquiry.findMany({
      include: {
        property: {
          select: {
            id: true,
            name: true,
            owner: { select: { user: { select: { name: true, email: true } } } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),

  updateStatus: async (userId: string, inquiryId: string, status: "NEW" | "CONTACTED" | "CLOSED") => {
    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id: inquiryId },
      include: { property: { select: { ownerId: true } } }
    });
    if (!inquiry) throw new AppError(404, "Inquiry not found");
    const owner = await prisma.ownerProfile.findUnique({ where: { userId } });
    if (!owner || owner.id !== inquiry.property.ownerId) throw new AppError(403, "Not authorized");
    return prisma.propertyInquiry.update({ where: { id: inquiryId }, data: { status } });
  }
};
