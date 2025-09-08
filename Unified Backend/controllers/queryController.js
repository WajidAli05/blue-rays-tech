import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

const sendQuery = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required." });
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  // Beautiful HTML template
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#f9fbfd; color:#333;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1)">
      <h2 style="color:#2563eb; margin-bottom:10px;">📩 New Contact Query</h2>
      <p style="font-size:16px; margin-bottom:20px;">You’ve received a new query from your website contact form.</p>
      
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <tr>
          <td style="padding:8px; font-weight:bold; color:#2563eb;">Name:</td>
          <td style="padding:8px;">${name}</td>
        </tr>
        <tr style="background:#f3f4f6;">
          <td style="padding:8px; font-weight:bold; color:#2563eb;">Email:</td>
          <td style="padding:8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding:8px; font-weight:bold; color:#2563eb;">Message:</td>
          <td style="padding:8px;">${message}</td>
        </tr>
      </table>

      <p style="font-size:14px; color:#6b7280;">This email was automatically sent from your website’s contact page.</p>
    </div>
  </div>
  `;

  // Mail options
  const mailOptions = {
    from: `"Blue Rays Contact Form" ${email}`,
    to: process.env.EMAIL_USER,
    subject: `New Query from ${name}`,
    html: htmlContent,
  };

  // Send email
  transporter
    .sendMail(mailOptions)
    .then(() => {
      res.status(200).json({ success: true, message: "Query sent successfully!" });
    })
    .catch((err) => {
      console.error("Email error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to send query. Try again later." });
    });
};

export { sendQuery };