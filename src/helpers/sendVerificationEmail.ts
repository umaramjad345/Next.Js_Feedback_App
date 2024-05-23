import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b4b1584e37c7e6",
        pass: "8dcfcc51e5ad4d",
      },
    });
    const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

    const mailOptions = {
      from: "umarziaii@gmail.com",
      to: email,
      subject: "Verification Code",
      html: emailHtml,
    };

    await transport.sendMail(mailOptions);

    return { success: true, message: "Verification Email Sent Successfully." };
  } catch (emailError) {
    console.error("Error Sending Verification Email:", emailError);
    return { success: false, message: "Failed to Send Verification Email" };
  }
}
