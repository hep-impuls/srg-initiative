import React from 'react';

interface InteractionModalProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
    isOpen,
    children
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 relative z-10">
                <div className="overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
