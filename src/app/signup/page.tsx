"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [glowTrigger, setGlowTrigger] = useState(false);

    useEffect(() => {
        setButtonDisabled(!(user.username && user.email && user.password));
    }, [user]);

    // Helper to restart glow animation
    const restartGlow = () => {
        setGlowTrigger(false);
        setTimeout(() => setGlowTrigger(true), 10); // small timeout to re-trigger animation
    };

    const onSignup = async () => {
        try {
            setLoading(true);
            setHasError(false);
            setGlowTrigger(true); // start loading glow
            const response = await axios.post("/api/users/signup", user);
            toast.success("Account created! Please login.");
            router.push("/login");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Signup failed"
            );
            setHasError(true);
            restartGlow(); // restart the glow animation on error
        } finally {
            setLoading(false);
            setGlowTrigger(false); // stop loading glow
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 to-black px-4">
            <div
                className={`w-full max-w-md bg-zinc-900 border rounded-xl shadow-xl p-8 transition duration-300 ease-in-out
                    ${
                        loading
                            ? glowTrigger
                                ? "border-green-400 animate-glow"
                                : "border-green-800"
                            : hasError
                            ? glowTrigger
                                ? "border-red-500 animate-glow"
                                : "border-red-500"
                            : "border-green-800"
                    }
                `}
            >
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    {loading ? "Loading..." : "Sign Up"}
                </h1>

                {/* input fields here unchanged */}
                <label
                    htmlFor="username"
                    className="block text-sm text-gray-300 mb-1"
                >
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    className="w-full mb-4 px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={user.username}
                    onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                    }
                />

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
                    value={user.password}
                    onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                    }
                />

                <button
                    onClick={onSignup}
                    disabled={buttonDisabled || loading}
                    className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ${
                        buttonDisabled || loading
                            ? "bg-green-800/50 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-500"
                    }`}
                >
                    {buttonDisabled ? "Complete all fields" : "Create Account"}
                </button>

                <Link
                    href="/login"
                    className="block text-center mt-4 text-sm text-green-400 hover:underline"
                >
                    Already have an account? Login
                </Link>
            </div>

            <style jsx>{`
                @keyframes neonPulse {
                    0% {
                        box-shadow: 0 0 0px #22c55e;
                    }
                    50% {
                        box-shadow: 0 0 15px #22c55e, 0 0 30px #22c55e;
                    }
                    100% {
                        box-shadow: 0 0 0px #22c55e;
                    }
                }

                .animate-glow {
                    animation: neonPulse 1.5s infinite;
                    border-width: 2px;
                }
            `}</style>
        </div>
    );
}
