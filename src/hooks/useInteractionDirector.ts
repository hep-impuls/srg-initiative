import { useState, useEffect } from 'react';
import { doc, onSnapshot, increment, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InteractionConfig, InteractionResults } from '../types/interaction';

export type InteractionPhase = 'input' | 'locked' | 'reveal';

interface UseInteractionDirectorProps {
    config: InteractionConfig;
    currentTime?: number; // Optional: Driven by audio
    startTime?: number; // When does the interaction start in the audio?
    duration?: number; // How long is the input phase?
}

export function useInteractionDirector({
    config,
    currentTime = 0,
    startTime = 0,
    duration = 30
}: UseInteractionDirectorProps) {

    const [phase, setPhase] = useState<InteractionPhase>('input');
    const [results, setResults] = useState<InteractionResults | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [userVote, setUserVote] = useState<string | number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Manage Phases based on Time
    useEffect(() => {
        // Relative time in the interaction window
        const relativeTime = currentTime - startTime;

        if (relativeTime < duration) {
            setPhase('input');
        } else if (relativeTime >= duration && relativeTime < duration + 5) {
            setPhase('locked');
        } else {
            setPhase('reveal');
        }
    }, [currentTime, startTime, duration]);

    // 2. Subscribe to Firestore Data (Realtime)
    useEffect(() => {
        const docRef = doc(db, 'interactions', config.id);

        const unsubscribe = onSnapshot(docRef, (snap: DocumentSnapshot) => {
            if (snap.exists()) {
                const data = snap.data();
                setResults({
                    totalVotes: data.total_votes || 0,
                    optionCounts: data.options || {}
                });
            } else {
                setResults({ totalVotes: 0, optionCounts: {} });
            }
        });

        return () => unsubscribe();
    }, [config.id]);

    // 3. User Vote Handling (Fingerprinting/LocalStorage)
    useEffect(() => {
        const storageKey = `vote_${config.id}`;
        const storedVote = localStorage.getItem(storageKey);
        if (storedVote) {
            setHasVoted(true);
            setUserVote(storedVote);
        }
    }, [config.id]);

    // 4. Vote Action
    const submitVote = async (optionId: string | number) => {
        if (hasVoted || isSubmitting || phase !== 'input') return;

        setIsSubmitting(true);

        try {
            const interactionRef = doc(db, 'interactions', config.id);

            // Use nested object for setDoc with merge instead of dot notation
            // Dot notation in keys is ONLY for updateDoc. 
            // setDoc interprets dot-keys literally as field names.
            await setDoc(interactionRef, {
                total_votes: increment(1),
                options: {
                    [optionId]: increment(1)
                }
            }, { merge: true });

            // Save to local storage
            localStorage.setItem(`vote_${config.id}`, String(optionId));
            setUserVote(optionId);
            setHasVoted(true);

        } catch (error) {
            console.error("Error submitting vote:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        phase,
        results,
        hasVoted,
        userVote,
        isSubmitting,
        submitVote
    };
}
