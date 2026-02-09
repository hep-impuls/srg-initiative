export type InteractionType = 'poll' | 'slider' | 'quiz' | 'ranking' | 'points' | 'guess' | 'info';


export interface InteractionOption {
    id: string;
    label: string; // The text to display
    isCorrect?: boolean; // Only for quizzes
}

export interface InteractionConfig {
    id: string;
    type: InteractionType;
    question: string;
    options: InteractionOption[];
    minLabel?: string; // Only for slider
    maxLabel?: string; // Only for slider
}

// Result data from Firestore
export interface InteractionResults {
    totalVotes: number;
    optionCounts: Record<string, number>; // optionId -> count
}

// For local state/optimistic UI
export interface UserVote {
    interactionId: string;
    optionId: string | number; // Slider value is number
    timestamp: number;
}
