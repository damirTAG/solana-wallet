import { useState } from "react";
import { create } from "zustand";

interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: Toast["type"], duration?: number) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type, duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
            }, duration);
        }
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const useToast = () => {
    const { addToast } = useToastStore();
    return {
        success: (message: string, duration?: number) => addToast(message, "success", duration),
        error: (message: string, duration?: number) => addToast(message, "error", duration), // no red
        info: (message: string, duration?: number) => addToast(message, "info", duration),
        warning: (message: string, duration?: number) => addToast(message, "warning", duration),
    };
};

// Toast item
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        warning: "⚠",
    };

    // Unified Solana-style color
    const colorClass = "bg-gray-900 border border-gray-700 text-white";

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`
        ${colorClass}
        border rounded-xl p-4 shadow-lg
        flex items-center gap-3 min-w-[300px] max-w-md
        transition-all duration-300
        ${isLeaving ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
        >
            <div className="shrink-0 w-6 h-6 flex items-center justify-center bg-[#00FFA3] rounded-full font-bold text-gray-900">
                {icons[toast.type]}
            </div>

            <p className="flex-1 text-white text-sm font-medium">{toast.message}</p>

            <button
                onClick={handleClose}
                className="shrink-0 text-white hover:bg-white hover:bg-opacity-10 rounded-lg p-1 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            <div className="flex flex-col gap-3 pointer-events-auto">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
