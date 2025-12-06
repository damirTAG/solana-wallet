export class DecryptionError extends Error {
    readonly cause?: unknown;

    constructor(message: string, cause?: unknown) {
        super(message);
        this.name = "DecryptionError";
        this.cause = cause;
    }
}

const isValidBase64 = (str: string): boolean => {
    if (!str || typeof str !== "string") return false;
    try {
        return btoa(atob(str)) === str;
    } catch {
        return false;
    }
};

export const cryptoLib = {
    encryptPrivateKey: async (privateKey: string, password: string): Promise<{ encrypted: string; salt: string; iv: string }> => {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

        const key = await crypto.subtle.deriveKey(
            { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );

        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(privateKey));

        return {
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv)),
        };
    },

    decryptPrivateKey: async (encrypted: string, password: string, salt: string, iv: string): Promise<string> => {
        // Validate inputs before attempting decryption
        if (!encrypted || !salt || !iv) {
            throw new DecryptionError("Missing encryption data. Wallet data may be corrupted.");
        }

        if (!isValidBase64(encrypted) || !isValidBase64(salt) || !isValidBase64(iv)) {
            throw new DecryptionError("Invalid wallet data format. The stored data may be corrupted.");
        }

        const enc = new TextEncoder();
        const dec = new TextDecoder();

        try {
            const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
            const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
            const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

            // Validate expected byte lengths
            if (saltBytes.length !== 16) {
                throw new DecryptionError("Invalid salt length. Wallet data may be corrupted.");
            }
            if (ivBytes.length !== 12) {
                throw new DecryptionError("Invalid IV length. Wallet data may be corrupted.");
            }

            const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]);

            const key = await crypto.subtle.deriveKey(
                { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );

            const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBytes }, key, encryptedBytes);

            return dec.decode(decrypted);
        } catch (error) {
            if (error instanceof DecryptionError) {
                throw error;
            }
            // OperationError from crypto.subtle.decrypt means wrong password or corrupted data
            if (error instanceof Error && error.name === "OperationError") {
                throw new DecryptionError("Incorrect password or corrupted wallet data.", error);
            }
            throw new DecryptionError("Decryption failed unexpectedly.", error);
        }
    },
};
