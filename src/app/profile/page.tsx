"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState("empty");
    const [glowTrigger, setGlowTrigger] = useState(false);
    const [hasError, setHasError] = useState(false);

    const getUserDetails = async () => {
        try {
            setLoading(true);
            setGlowTrigger(true);
            setHasError(false);

            const response = await axios.get("/api/users/me");
            setData(response.data.data._id);
        } catch (error: any) {
            setHasError(true);
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch user data"
            );
        } finally {
            setLoading(false);
            setTimeout(() => setGlowTrigger(false), 300);
        }
    };

    const logoutUser = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Logout failed"
            );
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
                    Profile
                </h1>

                <p className="text-sm text-gray-300 mb-2 text-center">
                    {loading
                        ? data === "empty"
                            ? ""
                            : "Loading user..."
                        : "User loaded"}
                </p>

                <h2 className="text-center mb-4 text-lg text-green-400 break-words">
                    {data === "empty" ? (
                        "No user data"
                    ) : (
                        <Link
                            href={`/profile/${data}`}
                            className="hover:underline"
                        >
                            {data}
                        </Link>
                    )}
                </h2>

                <div className="flex gap-4">
                    <button
                        onClick={logoutUser}
                        className="w-full py-2 rounded-md text-white font-semibold bg-green-700 hover:bg-green-600 transition duration-200"
                    >
                        Logout
                    </button>
                    <button
                        onClick={getUserDetails}
                        className="w-full py-2 rounded-md text-white font-semibold bg-green-600 hover:bg-green-500 transition duration-200"
                    >
                        Get Details
                    </button>
                </div>
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
