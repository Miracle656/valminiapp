"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { messageStorage } from "@/lib/storage";
import { ValentineMessage } from "@/lib/types";

interface ViewMessageProps {
    messageId: string;
}

export default function ViewMessage({ messageId }: ViewMessageProps) {
    const router = useRouter();
    const { user } = useUser();
    const [message, setMessage] = useState<ValentineMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasResponded, setHasResponded] = useState(false);

    useEffect(() => {
        // Load message from localStorage
        const loadedMessage = messageStorage.getById(messageId);
        setMessage(loadedMessage);
        setLoading(false);

        if (loadedMessage?.response) {
            setHasResponded(true);
        }
    }, [messageId]);

    const handleResponse = (response: 'yes' | 'no') => {
        if (!message || !user?.data) return;

        messageStorage.update(message.id, {
            response,
            respondedAt: Date.now(),
        });

        setHasResponded(true);
        setMessage({ ...message, response, respondedAt: Date.now() });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100">
                <div className="text-center">
                    <div className="animate-spin text-6xl mb-4">💕</div>
                    <p className="text-rose-600 font-semibold">Loading message...</p>
                </div>
            </div>
        );
    }

    if (!message) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">
                        Message Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This Valentine message doesn't exist or has been deleted.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Check if user's FID matches recipient
    const isRecipient = user?.data?.fid === message.recipientFid;

    if (!user?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">
                        Sign In Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to view this Valentine message
                    </p>
                </div>
            </div>
        );
    }

    if (!isRecipient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 mb-2">
                        This message is for someone special!
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Only the intended recipient can view this message.
                    </p>
                    <div className="bg-pink-50 p-3 rounded-xl border border-pink-200 mb-6">
                        <p className="text-xs text-gray-600">Recipient FID:</p>
                        <p className="text-sm font-mono text-rose-600 break-all">
                            {message.recipientFid}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show response confirmation if already responded
    if (hasResponded && message.response) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
                    <div className="text-6xl mb-4">
                        {message.response === 'yes' ? '💕' : '💔'}
                    </div>
                    <h2 className="text-3xl font-bold text-rose-600 mb-4">
                        {message.response === 'yes' ? 'You said Yes!' : 'You said No'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your response has been recorded.
                    </p>
                    <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200 mb-6">
                        <p className="text-gray-700 italic text-lg leading-relaxed">
                            "{message.message}"
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            - From @{message.senderUsername || `FID ${message.senderFid}`}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    // Show message with response buttons
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4 animate-pulse">💌</div>
                    <h1 className="text-3xl font-bold text-rose-600 mb-2">
                        You Have a Valentine Message!
                    </h1>
                    <p className="text-gray-600">
                        From @{message.senderUsername || `FID ${message.senderFid}`}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-2xl border-2 border-pink-200 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-8xl opacity-10">💕</div>
                    <p className="text-gray-800 text-xl leading-relaxed relative z-10 italic">
                        "{message.message}"
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => handleResponse('yes')}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg text-lg"
                    >
                        💕 Yes! I'll be your Valentine
                    </button>

                    <button
                        onClick={() => handleResponse('no')}
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all text-lg"
                    >
                        💔 No, thank you
                    </button>
                </div>

                <p className="text-xs text-center text-gray-500">
                    Your response will be saved anonymously
                </p>
            </div>
        </div>
    );
}
