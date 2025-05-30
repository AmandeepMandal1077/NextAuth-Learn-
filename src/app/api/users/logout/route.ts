import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = NextResponse.json(
            { message: "Logout successful", success: true },
            { status: 200 }
        );
        res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        return res;
    } catch (error: any) {
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
