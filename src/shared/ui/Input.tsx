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
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/40 transition-all"
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
);
