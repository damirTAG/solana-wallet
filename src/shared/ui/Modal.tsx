interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-500/5">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors active:scale-95">
                            ×
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
};
