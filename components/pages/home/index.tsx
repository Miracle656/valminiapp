"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEnvironment } from "@/contexts/environment-context";
import { useUser } from "@/contexts/user-context";
import { useAccount } from "wagmi";
import { Website } from "../website";
import { messageStorage } from "@/lib/storage";
import { ValentineMessage } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { user, signIn, isLoading } = useUser();
  const { address } = useAccount();
  const { isInBrowser } = useEnvironment();
  const [sentMessages, setSentMessages] = useState<ValentineMessage[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<ValentineMessage[]>([]);

  useEffect(() => {
    if (user?.data?.fid && address) {
      // Load messages sent by this user
      const sent = messageStorage.getBySender(user.data.fid);
      setSentMessages(sent);

      // Load messages received by this wallet
      const received = messageStorage.getByRecipient(address);
      setReceivedMessages(received);
    }
  }, [user?.data?.fid, address]);

  if (isInBrowser) {
    return <Website />;
  }

  if (!user?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
          <div className="text-6xl mb-6 animate-bounce">💕</div>
          <h1 className="text-4xl font-bold text-rose-600 mb-4">
            Valentine Messages
          </h1>
          <p className="text-gray-600 mb-8">
            Send secret wallet-gated messages to your crush! 💌
          </p>
          <button
            onClick={signIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "💕 Sign In to Start"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-4xl font-bold text-rose-600 mb-2">
            Valentine Messages
          </h1>
          <p className="text-gray-600">
            Hey @{user.data.username || user.data.display_name}! 👋
          </p>
        </div>

        {/* Create Message Button */}
        <button
          onClick={() => router.push("/create")}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-5 px-6 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg mb-8 text-lg"
        >
          💌 Create New Valentine Message
        </button>

        {/* Messages Dashboard */}
        <div className="space-y-6">
          {/* Received Messages */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
            <h2 className="text-2xl font-bold text-rose-600 mb-4 flex items-center gap-2">
              <span>💝</span>
              <span>Messages for You</span>
            </h2>
            {receivedMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No messages yet. Maybe someone will send you one soon! 💕
              </p>
            ) : (
              <div className="space-y-3">
                {receivedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => router.push(`/message/${msg.id}`)}
                    className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-xl border-2 border-pink-200 cursor-pointer hover:border-rose-400 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          From @{msg.senderUsername || `FID ${msg.senderFid}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {msg.response ? (
                          <span className="text-2xl">
                            {msg.response === "yes" ? "✅" : "❌"}
                          </span>
                        ) : (
                          <span className="text-xs bg-rose-500 text-white px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Messages */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
            <h2 className="text-2xl font-bold text-rose-600 mb-4 flex items-center gap-2">
              <span>📤</span>
              <span>Messages You Sent</span>
            </h2>
            {sentMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                You haven't sent any messages yet. Create your first one! 💝
              </p>
            ) : (
              <div className="space-y-3">
                {sentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-xl border-2 border-pink-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          To: FID {msg.recipientFid}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1 italic">
                          "{msg.message}"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        {msg.response ? (
                          <div className="text-center">
                            <div className="text-3xl mb-1">
                              {msg.response === "yes" ? "💕" : "💔"}
                            </div>
                            <p className="text-xs font-semibold text-gray-700">
                              {msg.response === "yes" ? "Yes!" : "No"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full">
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Made with 💕 for Valentine's Day</p>
        </div>
      </div>
    </div>
  );
}

