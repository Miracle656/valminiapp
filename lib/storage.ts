// Local storage utilities for Valentine messages

import { ValentineMessage } from './types';

const STORAGE_KEY = 'valentine_messages';

export const messageStorage = {
    // Get all messages
    getAll(): ValentineMessage[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Get message by ID
    getById(id: string): ValentineMessage | null {
        const messages = this.getAll();
        return messages.find(m => m.id === id) || null;
    },

    // Get messages sent by a user
    getBySender(senderFid: number): ValentineMessage[] {
        const messages = this.getAll();
        return messages.filter(m => m.senderFid === senderFid);
    },

    // Get messages for a recipient (by FID)
    getByRecipient(recipientFid: number): ValentineMessage[] {
        const messages = this.getAll();
        return messages.filter(
            m => m.recipientFid === recipientFid
        );
    },

    // Save a new message
    save(message: ValentineMessage): void {
        const messages = this.getAll();
        messages.push(message);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    },

    // Update a message (for responses)
    update(id: string, updates: Partial<ValentineMessage>): void {
        const messages = this.getAll();
        const index = messages.findIndex(m => m.id === id);
        if (index !== -1) {
            messages[index] = { ...messages[index], ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    },

    // Generate a unique ID
    generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
