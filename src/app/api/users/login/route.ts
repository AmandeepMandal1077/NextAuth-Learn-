import { connectDB } from "@/app/dbConfig/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        //console.log("body: ", reqBody);
        const { email, password } = reqBody;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User doesn't exist" },
                { status: 400 }
            );
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return NextResponse.json(
                { error: "invalid password" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });

        const response = NextResponse.json({
            message: "Login successfully",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        //console.log("Error occured");
        return NextResponse.json(
            { message: "Failed to created user" },
            { status: 500 }
        );
    }
}
