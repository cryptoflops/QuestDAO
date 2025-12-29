import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'signature';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}) => {

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-sm rounded-lg",
        secondary: "bg-secondary text-white hover:bg-stacks-dark rounded-lg",
        ghost: "bg-transparent text-foreground hover:bg-muted/50 rounded-lg",
        signature: "bg-primary text-white font-bold hover:scale-[1.05] active:scale-[0.95] shadow-xl shadow-primary/20 rounded-lg",
    };

    const sizes = {
        sm: "h-9 px-4 text-[10px] font-bold uppercase tracking-[0.2em]",
        md: "h-11 px-8 text-[12px] font-bold uppercase tracking-[0.2em]",
        lg: "h-14 px-10 text-[14px] font-bold uppercase tracking-[0.2em]",
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
