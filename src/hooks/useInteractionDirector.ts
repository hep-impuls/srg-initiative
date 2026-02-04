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

    // 3. User Identification & Local Storage
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Use Firebase Anonymous Auth for a secure, persistent UID
        import('../lib/firebase').then(({ ensureAuth }) => {
            ensureAuth().then(user => {
                setUserId(user.uid);
            }).catch(err => {
                console.error("Auth failed:", err);
            });
        });

        const storageKey = `vote_${config.id}`;
        const storedVote = localStorage.getItem(storageKey);
        if (storedVote) {
            setHasVoted(true);
            setUserVote(storedVote);
        }
    }, [config.id]);

    // 4. Vote Action
    const submitVote = async (optionId: string | number) => {
        if (hasVoted || isSubmitting || phase !== 'input' || !userId) return;

        setIsSubmitting(true);

        try {
            const voteId = `${userId}_${config.id}`;
            const userVoteRef = doc(db, 'user_votes', voteId);
            const interactionRef = doc(db, 'interactions', config.id);

            // 1. Create the unique user_vote record first.
            // If this fails (e.g. because it already exists), 
            // the firestore rules will block it and we stop.
            await setDoc(userVoteRef, {
                timestamp: new Date().toISOString(),
                value: optionId,
                interactionId: config.id
            });

            // 2. Increment the aggregated counters
            await setDoc(interactionRef, {
                total_votes: increment(1),
                options: {
                    [optionId]: increment(1)
                }
            }, { merge: true });

            // Save to local storage for UI persistence
            localStorage.setItem(`vote_${config.id}`, String(optionId));
            setUserVote(optionId);
            setHasVoted(true);

        } catch (error) {
            console.error("Error submitting vote:", error);
            // If it failed because of duplicate vote, still mark as voted locally
            if ((error as any).code === 'permission-denied' || (error as any).message?.includes('already exists')) {
                setHasVoted(true);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Auto-Save Logic (Debounce)
    const [draftVote, setDraftVote] = useState<string | number | null>(null);
    const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);

    const handleInteraction = (value: string | number) => {
        if (hasVoted || isSubmitting || phase !== 'input') return;
        setDraftVote(value);
        setLastInteractionTime(Date.now());
    };

    useEffect(() => {
        if (draftVote === null || hasVoted) return;

        const timer = setTimeout(() => {
            if (!hasVoted) {
                submitVote(draftVote);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [draftVote, lastInteractionTime, hasVoted]);

    return {
        phase,
        results,
        hasVoted,
        userVote,
        isSubmitting,
        submitVote,
        handleInteraction // Expose this for continuous inputs
    };
}
