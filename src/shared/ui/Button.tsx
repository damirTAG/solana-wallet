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
    const baseStyles = "px-4 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 active:scale-95",
        secondary:
            "bg-black/40 backdrop-blur-sm border border-green-500/20 text-gray-300 hover:border-green-500/40 hover:text-green-400 hover:shadow-lg hover:shadow-green-500/10 active:scale-95",
        danger: "bg-red-600 border border-red-500/40 text-white hover:bg-red-700 hover:border-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95",
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};
