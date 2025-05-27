"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    // New state to force re-render for animation
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        setButtonDisabled(!user.email);
    }, [user]);

    const onForgotPassword = async () => {
        try {
            // Increment key to force remount of animated div on every login attempt
            setAnimationKey((prev) => prev + 1);
            setLoading(true);
            setHasError(false);

            const res = await axios.post("/api/users/forgotpassword", user);
            //console.log("Response from forgot password:", res.data);

            toast.success("Logged in successfully!");
            router.push("/profile");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Resetting Password failed"
            );
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 to-black px-4">
            <div
                key={animationKey} // force remount to restart animation
                className={`w-full max-w-md border rounded-xl shadow-xl p-8 transition-all duration-300 ${
                    hasError
                        ? "border-red-500 animate-none"
                        : loading
                        ? "border-green-400 neon-border"
                        : "border-green-800"
                } bg-zinc-900`}
            >
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    {loading
                        ? "Verifying Email..."
                        : hasError
                        ? "Invalid Email"
                        : "Password Reset"}
                </h1>

                <label
                    htmlFor="email"
                    className="block text-sm text-gray-300 mb-1"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className="w-full mb-4 px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={user.email}
                    onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                    }
                />

                <button
                    onClick={onForgotPassword}
                    disabled={buttonDisabled}
                    className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ${
                        buttonDisabled
                            ? "bg-green-800/50 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-500"
                    }`}
                >
                    {buttonDisabled ? "Fill all fields" : "Reset Password"}
                </button>
            </div>

            {/* Neon Animation Style */}
            <style jsx>{`
                .neon-border {
                    animation: neonPulse 2s infinite ease-in-out;
                    box-shadow: 0 0 8px #22c55e, 0 0 16px #22c55e,
                        0 0 24px #22c55e;
                }

                @keyframes neonPulse {
                    0% {
                        box-shadow: 0 0 4px #22c55e;
                    }
                    50% {
                        box-shadow: 0 0 12px #22c55e, 0 0 24px #22c55e;
                    }
                    100% {
                        box-shadow: 0 0 4px #22c55e;
                    }
                }
            `}</style>
        </div>
    );
}
