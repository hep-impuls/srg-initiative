import React from 'react';

interface SafeHTMLProps {
    content: string | string[];
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

/**
 * Safely renders HTML content from trusted JSON sources.
 * Supports both single strings with tags like <strong> and arrays of strings rendered as <ul>.
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({
    content,
    className = '',
    as: Component = 'div'
}) => {
    if (Array.isArray(content)) {
        return (
            <ul className={`list-disc pl-5 space-y-2 ${className}`}>
                {content.map((item, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        );
    }

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};
