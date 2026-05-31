import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email using Nodemailer
 */
export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@anointedtrinity.co.za",
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
};

/**
 * Send application confirmation email
 */
export const sendApplicationConfirmationEmail = async (
  parentEmail: string,
  parentName: string,
  childName: string,
  referenceNumber: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0b8eff 0%, #0058ab 100%); color: white; padding: 20px; border-radius: 10px; }
          .content { padding: 20px; background: #f9fafb; border-radius: 10px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #0b8eff; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ATCP</h1>
          </div>
          <div class="content">
            <p>Dear ${parentName},</p>
            <p>Thank you for submitting your application for ${childName} to Anointed Trinity Creche & Pre School.</p>
            <p>Your <strong>Application Reference Number</strong> is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #0b8eff;">${referenceNumber}</p>
            <p>Please save this reference number for your records. You can use it to track your application status on our website.</p>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>We will review your application within 3-5 business days</li>
              <li>You will receive an email with the decision</li>
              <li>If approved, we will contact you to schedule a visit</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br><strong>Anointed Trinity Creche & Pre School Management</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Anointed Trinity Creche & Pre School. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: parentEmail,
    subject: "Application Received - Anointed Trinity Creche & Pre School",
    html,
  });
};

/**
 * Send application status update email
 */
export const sendApplicationStatusEmail = async (
  parentEmail: string,
  parentName: string,
  childName: string,
  referenceNumber: string,
  status: string,
  message?: string
) => {
  const statusColor = status === "APPROVED" ? "#10b981" : "#ef4444";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0b8eff 0%, #0058ab 100%); color: white; padding: 20px; border-radius: 10px; }
          .status-badge { display: inline-block; padding: 10px 20px; background: ${statusColor}; color: white; border-radius: 5px; font-weight: bold; }
          .content { padding: 20px; background: #f9fafb; border-radius: 10px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${parentName},</p>
            <p>We have reviewed your application for ${childName}.</p>
            <p><strong>Application Reference:</strong> ${referenceNumber}</p>
            <p><strong>Status:</strong> <span class="status-badge">${status}</span></p>
            ${message ? `<p>${message}</p>` : ""}
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br><strong>Anointed Trinity Creche & Pre School Management</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Anointed Trinity Creche & Pre School. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: parentEmail,
    subject: `Application ${status} - Anointed Trinity Creche & Pre School`,
    html,
  });
};
