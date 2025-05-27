import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        if (!token) {
            return NextResponse.json(
                { error: "Token not found" },
                { status: 401 }
            );
        }

        const decodedToken: any = jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
        );
        if (!decodedToken) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        return decodedToken.id;
    } catch (error: any) {
        console.log("Error in getDataFromToken: ", error.message);
        return NextResponse.json(
            { error: "Failed to get data from token" },
            { status: 500 }
        );
    }
};
