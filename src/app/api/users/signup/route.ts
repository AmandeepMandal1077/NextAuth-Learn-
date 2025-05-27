import { connectDB } from "@/app/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        //console.log("body: ", reqBody);
        const { username, email, password } = reqBody;

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: "User already there" },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: encryptedPassword,
        });

        //console.log("user created: ", newUser);

        const savedUser = await newUser.save();
        //console.log("sent for verification: ", savedUser);
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                savedUser,
            },
            { status: 201 }
        );
    } catch (error: any) {
        //console.log("Error occured");
        return NextResponse.json(
            { message: "Failed to created user" },
            { status: 500 }
        );
    }
}
