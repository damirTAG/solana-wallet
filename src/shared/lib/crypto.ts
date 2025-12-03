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
        const enc = new TextEncoder();
        const dec = new TextDecoder();

        const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
        const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
        const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

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
    },
};
