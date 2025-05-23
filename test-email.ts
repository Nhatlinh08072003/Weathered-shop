// test-email.ts
import nodemailer from "nodemailer";

async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("Nodemailer transporter verified");

    const info = await transporter.sendMail({
      from: `"Weathered Test" <${process.env.EMAIL_USER}>`,
      to: "letiennhatlinh08072003@gmail.com",
      subject: "Test Email from Weathered",
      text: "This is a test email to verify Nodemailer configuration.",
      html: "<p>This is a test email to verify Nodemailer configuration.</p>",
    });

    console.log("Test email sent:", info.messageId);
  } catch (error) {
    console.error("Test email error:", error);
  }
}

testEmail();