// Types for Valentine Message App

export interface ValentineMessage {
    id: string;
    recipientFid: number; // Changed from recipientAddress to recipientFid
    message: string;
    senderFid: number;
    senderUsername?: string;
    response: 'yes' | 'no' | null;
    createdAt: number;
    respondedAt?: number;
}

export interface CreateMessageData {
    recipientFid: number; // Changed from recipientAddress to recipientFid
    message: string;
}
