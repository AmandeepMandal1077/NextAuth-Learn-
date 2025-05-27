"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function VerifyEmail() {
    const [err, setErr] = useState(false);
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [emailType, setEmailType] = useState("VERIFY");
    const [password, setPassword] = useState("");
    const [successPasswordReset, setSuccessPasswordReset] = useState(false);

    const checkToken = async () => {
        try {
            if (emailType === "RESET") {
                return;
            }
            const response = await axios.post("/api/users/verifyemail", {
                token,
                emailType,
            });

            // console.log("Response from verification:", response.data);
            if (response.data.success) {
                setVerified(true);
            } else {
                setErr(true);
            }
        } catch (error: any) {
            console.error("Error verifying email:", error);
            setErr(true);
        }
    };

    const passwordReset = async () => {
        try {
            const response = await axios.post("/api/users/verifyemail", {
                token,
                emailType,
                password,
            });

            // console.log("Response from password reset:", response.data);
            if (response.data.success) {
                setVerified(true);
                setSuccessPasswordReset(true);
            } else {
                setErr(true);
            }
        } catch (error: any) {
            console.error("Error resetting password:", error);
            setErr(true);
        }
    };

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]?.split("&")[0];
        const emailType = window.location.search.split("&")[1]?.split("=")[1];

        if (urlToken) {
            setToken(urlToken || "");
            setEmailType(emailType || "VERIFY");
        } else {
            setErr(true);
        }
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            checkToken();
        }
    }, [token]);

    // Render the component based on verification status
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 to-black px-4">
            <div className="w-full max-w-md bg-zinc-900 border rounded-xl shadow-xl p-8">
                {!successPasswordReset && emailType === "RESET" ? (
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm text-gray-300 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            className="w-full mb-6 px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}
                        />

                        <button
                            onClick={passwordReset}
                            className={`w-full hover:cursor-pointer ${
                                password.length < 4 || password.length > 20
                                    ? "bg-green-700"
                                    : "bg-green-600"
                            } hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                            disabled={
                                password.length < 4 || password.length > 20
                            }
                        >
                            {password.length < 4 || password.length > 20
                                ? "Password must be 4-20 characters"
                                : "Reset Password"}
                        </button>
                    </div>
                ) : verified ? (
                    <div className="text-center text-green-500">
                        <h1 className="text-2xl font-bold mb-4">
                            {password.length > 0
                                ? "Password Reset Successfully"
                                : "Email Verified!"}
                        </h1>
                        <p>
                            {emailType === "VERIFY"
                                ? "Your email has been successfully verified."
                                : "Your password has been successfully reset."}
                        </p>
                        <Link
                            href="/login"
                            className="text-blue-500 underline mt-4"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : err ? (
                    <div className="text-center text-red-500">
                        <h1 className="text-2xl font-bold mb-4">
                            {"${emailType} Failed"}
                        </h1>
                        <p>Invalid or expired verification link.</p>
                        <Link
                            href="/signup"
                            className="text-blue-500 underline mt-4"
                        >
                            Try Again
                        </Link>
                    </div>
                ) : (
                    <div className="text-center text-yellow-500">
                        <h1 className="text-2xl font-bold mb-4">
                            Verifying...
                        </h1>
                        <p>Please wait while we verify your email.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
