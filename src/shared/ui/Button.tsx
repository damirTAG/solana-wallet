import React, { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
    children: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    type = "button",
}) => {
    const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-[#00FFA3] hover:bg-[#00d28b] text-gray-900",
        secondary: "bg-gray-800 hover:bg-gray-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};
