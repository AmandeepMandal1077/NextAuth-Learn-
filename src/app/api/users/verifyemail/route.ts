import { connectDB } from "@/app/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token, emailType, password } = reqBody;
        //console.log("Received token:", token);
        //console.log("Received emailType:", emailType);

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        if (emailType === "VERIFY") {
            const user = await User.findOne({
                verifyToken: token,
                verifyTokenExpiry: { $gt: Date.now() },
            });
            //console.log("user is: ", user);

            if (!user) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 400 }
                );
            }

            user.isVerified = true;
            user.verifyToken = undefined;
            user.verifyTokenExpiry = undefined;

            await user.save();
        } else if (emailType === "RESET") {
            //console.log("while resetting password");
            const user = await User.findOne({
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: { $gt: Date.now() },
            });

            //console.log("user is: ", user);

            if (!user) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 400 }
                );
            }

            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            user.isVerified = true;
            user.password = encryptedPassword;
            user.forgotPasswordToken = undefined;
            user.forgotPasswordTokenExpiry = undefined;

            await user.save();
        } else {
            return NextResponse.json(
                { error: "Invalid email type" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: "Email verified successfully",
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        //console.error("Error in POST /users/verifyemail:", error.message);
        return NextResponse.json(
            { error: "Failed to verify email" },
            { status: 500 }
        );
    }
}
