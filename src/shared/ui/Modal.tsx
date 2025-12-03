interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-700">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};
