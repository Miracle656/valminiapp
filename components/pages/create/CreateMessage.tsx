"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { messageStorage } from "@/lib/storage";
import { ValentineMessage } from "@/lib/types";
import { env } from "@/lib/env";

export default function CreateMessage() {
    const router = useRouter();
    const { user } = useUser();
    const [recipientFid, setRecipientFid] = useState("");
    const [message, setMessage] = useState("");
    const [generatedLink, setGeneratedLink] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        if (!recipientFid || !message || !user?.data) return;

        setIsCreating(true);

        // Generate unique message
        const messageId = messageStorage.generateId();
        const valentineMessage: ValentineMessage = {
            id: messageId,
            recipientFid: Number(recipientFid.trim()),
            message: message.trim(),
            senderFid: user.data.fid,
            senderUsername: user.data.username,
            response: null,
            createdAt: Date.now(),
        };

        // Save to localStorage
        messageStorage.save(valentineMessage);

        // Generate shareable link
        const link = `${env.NEXT_PUBLIC_URL}/message/${messageId}`;
        setGeneratedLink(link);
        setIsCreating(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        alert("Link copied! 💕");
    };

    const reset = () => {
        setRecipientFid("");
        setMessage("");
        setGeneratedLink("");
    };

    if (!user?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">
                        💕 Please sign in to create a Valentine message
                    </h2>
                </div>
            </div>
        );
    }

    if (generatedLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">💌</div>
                        <h2 className="text-3xl font-bold text-rose-600 mb-2">
                            Message Created!
                        </h2>
                        <p className="text-gray-600">
                            Share this link with your valentine
                        </p>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-200 mb-6">
                        <p className="text-sm text-gray-700 break-all">{generatedLink}</p>
                    </div>

                    <button
                        onClick={copyLink}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg mb-3"
                    >
                        📋 Copy Link
                    </button>

                    <button
                        onClick={reset}
                        className="w-full bg-white text-rose-600 font-semibold py-3 px-6 rounded-xl border-2 border-rose-300 hover:bg-rose-50 transition-all"
                    >
                        Create Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💕</div>
                    <h1 className="text-4xl font-bold text-rose-600 mb-2">
                        Create Valentine Message
                    </h1>
                    <p className="text-gray-600">Send a special message to your crush</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-rose-700 mb-2">
                            Recipient's FID (Farcaster ID)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g., 3621"
                            value={recipientFid}
                            onChange={(e) => setRecipientFid(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Only this Farcaster user can view your message
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-rose-700 mb-2">
                            Your Message
                        </label>
                        <textarea
                            placeholder="Will you be my valentine? 💕"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-rose-400 focus:outline-none transition-colors resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {message.length} characters
                        </p>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={!recipientFid || !message || isCreating}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isCreating ? "Creating..." : "💌 Generate Link"}
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-white text-rose-600 font-semibold py-3 px-6 rounded-xl border-2 border-rose-300 hover:bg-rose-50 transition-all"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
