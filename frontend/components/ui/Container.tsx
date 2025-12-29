import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container: React.FC<ContainerProps> = ({
    children,
    className = '',
    size = 'lg'
}) => {
    const maxWidths = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-6xl', // Standard luxurious width
        xl: 'max-w-screen-xl',
        full: 'max-w-full',
    };

    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidths[size]} ${className}`}>
            {children}
        </div>
    );
};

export default Container;
