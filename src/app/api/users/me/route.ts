import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/dbConfig/dbConfig";
import User from "@/models/user.model";

connectDB();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User data fetched successfully", data: user },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to get user data" },
            { status: 500 }
        );
    }
}
