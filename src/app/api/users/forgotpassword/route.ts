import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/dbConfig/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helpers/mailer";

connectDB();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        // console.log("Request body:", reqBody);
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        // console.log("User found:", user);
        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id,
        });

        return NextResponse.json(
            {
                message: "Reset password email sent successfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        // console.error("Error in POST /users/forgotpassword:", error.message);
        return NextResponse.json(
            { error: "Failed to process reset password request" },
            { status: 500 }
        );
    }
}
