export const Input = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    error = "",
}: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    error?: string;
}) => (
    <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFA3] transition-colors"
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
);
