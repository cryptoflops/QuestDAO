import React from 'react';
import Container from './ui/Container';

interface QuestGridProps {
    children: React.ReactNode;
}

const QuestGrid: React.FC<QuestGridProps> = ({ children }) => {
    return (
        <Container className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                {children}
            </div>
        </Container>
    );
};

export default QuestGrid;
