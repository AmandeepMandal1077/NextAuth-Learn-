import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
            });

            // if (!user) {
            //     throw new Error("User not found for password reset");
            // }

            // console.log("User found for reset:", user);
            // console.log("token: ", user.forgotPasswordToken);
            // console.log("expiry: ", user.forgotPasswordTokenExpiry);
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "5c68ec2c706acb",
                pass: "b8e3339a7d9f79",
            },
        });

        const mailOptions = {
            from: "mandalamandeep@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify Your Email"
                    : "Reset Your Password",
            html: `<p>Click the link below to ${
                emailType === "VERIFY"
                    ? "verify your email"
                    : "reset your password"
            }:</p><a href="${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}&emailType=${emailType}">Click here <p>${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}</p></a>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse.response);
        return mailResponse;
    } catch (error: any) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};
