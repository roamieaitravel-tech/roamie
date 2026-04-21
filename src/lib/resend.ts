import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not defined. Email notifications will not be sent.");
}

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("Attempted to send email without RESEND_API_KEY configured.");
    return { data: null, error: "Missing RESEND_API_KEY" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Roamie <notifications@roamie.com>", // Change to verified domain
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Failed to send email via Resend SDK:", error);
    return { data: null, error };
  }
}
