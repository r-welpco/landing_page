import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getWhatIsWelpcoHtml, getEmailSubject, type EmailLocale, type Segment } from "@/lib/email-templates";
import { getDb } from "@/db";
import { preLaunchSignups } from "@/db/schema";

const SubscribeSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    locale: z.enum(["en", "fr"]).optional(),
    interestedCustomer: z.boolean().optional(),
    interestedWelper: z.boolean().optional(),
    comment: z.string().max(2000).optional(),
  })
  .refine((d) => d.interestedCustomer || d.interestedWelper, {
    message: "Please select at least one option (Customer or Welper)",
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Validation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, locale, interestedCustomer, interestedWelper, comment } = parsed.data;
  const emailLocale: EmailLocale = locale ?? "fr";
  const interestedCustomerVal = interestedCustomer ?? false;
  const interestedWelperVal = interestedWelper ?? false;
  const commentVal = comment ?? "";

  const segment: string = interestedCustomerVal && interestedWelperVal
    ? "both"
    : interestedCustomerVal
      ? "customer"
      : "welper";

  const smtpHost = process.env.SMTP_HOST ?? "localhost";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpFrom = process.env.SMTP_FROM ?? "noreply@welpco.com";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  });

  const db = getDb();
  if (db) {
    try {
      await db.insert(preLaunchSignups).values({
        email,
        segment,
        locale: emailLocale,
        interestedCustomer: interestedCustomerVal,
        interestedWelper: interestedWelperVal,
        comment: commentVal || null,
      });
    } catch (err) {
      console.error("[pre-launch subscribe] DB insert failed", err);
      return NextResponse.json(
        { error: "Failed to save your response. Please try again." },
        { status: 502 }
      );
    }
  }

  const segmentsToEmail: Segment[] = [];
  if (interestedCustomerVal) segmentsToEmail.push("customer");
  if (interestedWelperVal) segmentsToEmail.push("welper");

  try {
    await Promise.all(
      segmentsToEmail.map((seg) => {
        const html = getWhatIsWelpcoHtml(seg, emailLocale);
        return transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: getEmailSubject(seg, emailLocale),
          html,
          text: html.replace(/<[^>]*>/g, ""),
        });
      })
    );
  } catch (err) {
    console.error("[pre-launch subscribe] send failed", err);
    return NextResponse.json(
      { error: "Failed to send confirmation email. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
