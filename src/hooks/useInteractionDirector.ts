import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InteractionConfig, InteractionResults } from '../types/interaction';

export type InteractionPhase = 'input' | 'locked' | 'reveal';
export type VoteStatus = 'idle' | 'drafting' | 'finalizing' | 'finalized';

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
    const voteStatusRef = useRef<VoteStatus>('idle');
    const lastSuccessfulVoteRef = useRef<string | number | null>(null);

    const normalizeVoteValue = (value: string | number): string | number => {
        if (config.type === 'guess') {
            const numeric = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
            if (Number.isNaN(numeric)) return 0;
            return Math.max(0, Math.round(numeric));
        }
        return value;
    };

    const toOptionKey = (value: string | number) => String(value);

    // Helper to update ref immediately
    const updateVoteStatus = (status: VoteStatus) => {
        voteStatusRef.current = status;
    };

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
        const draftKey = `vote_draft_${config.id}`;

        const storedVote = localStorage.getItem(storageKey);
        const draftVote = localStorage.getItem(draftKey);

        if (storedVote) {
            setHasVoted(true);
            setUserVote(storedVote);
        } else if (draftVote) {
            setUserVote(draftVote);
        }
    }, [config.id]);

    const saveDraft = async (optionId: string | number) => {
        const normalizedOptionId = normalizeVoteValue(optionId);

        // Only save drafts if we're idle or already drafting (not finalizing/finalized)
        const currentStatus = voteStatusRef.current as VoteStatus;
        if (hasVoted || phase !== 'input' || currentStatus === 'finalizing' || currentStatus === 'finalized') return;

        updateVoteStatus('drafting');

        try {
            let currentUserId = userId;
            if (!currentUserId) {
                const { ensureAuth } = await import('../lib/firebase');
                const user = await ensureAuth();
                currentUserId = user.uid;
                setUserId(currentUserId);
            }

            const voteId = `${currentUserId}_${config.id}`;
            const userVoteRef = doc(db, 'user_votes', voteId);

            // Double check voteStatus inside the async block using ref to bypass closure narrowing
            const statusAfterAwait = voteStatusRef.current as VoteStatus;
            if (statusAfterAwait === 'finalizing' || statusAfterAwait === 'finalized') return;

            await setDoc(userVoteRef, {
                timestamp: new Date().toISOString(),
                value: normalizedOptionId,
                interactionId: config.id,
                isDraft: true
            }, { merge: true });

            localStorage.setItem(`vote_draft_${config.id}`, String(normalizedOptionId));

            // Only update state if we haven't finalized
            const finalStatusCheck = voteStatusRef.current as VoteStatus;
            if (finalStatusCheck !== 'finalizing' && finalStatusCheck !== 'finalized') {
                lastSuccessfulVoteRef.current = normalizedOptionId;
                setUserVote(normalizedOptionId);
            }

            updateVoteStatus('idle'); // Return to idle after draft save
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    };

    // 5. Final Vote Submission (Locks UI & Increments Community Count)
    const submitVote = async (optionId: string | number) => {
        const normalizedOptionId = normalizeVoteValue(optionId);
        const optionKey = toOptionKey(normalizedOptionId);

        const currentStatus = voteStatusRef.current as VoteStatus;
        if (hasVoted || isSubmitting || phase !== 'input' || currentStatus === 'finalizing' || currentStatus === 'finalized') return;

        updateVoteStatus('finalizing'); // Block any further drafts immediately
        setIsSubmitting(true);

        try {
            let currentUserId = userId;
            if (!currentUserId) {
                const { ensureAuth } = await import('../lib/firebase');
                const user = await ensureAuth();
                currentUserId = user.uid;
                setUserId(currentUserId);
            }

            const voteId = `${currentUserId}_${config.id}`;
            const userVoteRef = doc(db, 'user_votes', voteId);
            const interactionRef = doc(db, 'interactions', config.id);

            // Use a transaction to atomically check and write both documents
            const { runTransaction } = await import('firebase/firestore');

            await runTransaction(db, async (transaction) => {
                const userVoteSnap = await transaction.get(userVoteRef);

                // Server-side duplicate vote prevention
                if (userVoteSnap.exists()) {
                    const existingData = userVoteSnap.data();
                    if (existingData && !existingData.isDraft) {
                        throw new Error('ALREADY_VOTED');
                    }
                }

                const interactionSnap = await transaction.get(interactionRef);
                const interactionData = interactionSnap.data();

                // Atomically write both documents
                transaction.set(userVoteRef, {
                    timestamp: new Date().toISOString(),
                    value: normalizedOptionId,
                    interactionId: config.id,
                    isDraft: false
                });

                // Calculate new values
                const currentTotalVotes = interactionData?.total_votes || 0;
                const currentOptionCount = interactionData?.options?.[optionKey] || 0;

                transaction.set(interactionRef, {
                    total_votes: currentTotalVotes + 1,
                    options: {
                        ...interactionData?.options,
                        [optionKey]: currentOptionCount + 1
                    }
                }, { merge: true });
            });

            // Save to local storage for UI persistence
            localStorage.setItem(`vote_${config.id}`, String(normalizedOptionId));
            localStorage.removeItem(`vote_draft_${config.id}`); // Clear draft
            lastSuccessfulVoteRef.current = normalizedOptionId;
            setUserVote(normalizedOptionId);
            setHasVoted(true);
            updateVoteStatus('finalized'); // Mark as finalized

        } catch (error: any) {
            console.error("Error submitting vote:", error);

            // Handle specific error cases
            if (error.message === 'ALREADY_VOTED') {
                // User already voted (possibly in another tab)
                setHasVoted(true);
                const stored = localStorage.getItem(`vote_${config.id}`);
                if (stored) setUserVote(stored);
            } else {
                // Other errors - don't mark as voted, allow retry
                updateVoteStatus('idle'); // Allow retry
                alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. Auto-Save Logic (Debounce)
    const [draftVote, setDraftVote] = useState<string | number | null>(null);
    const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);

    const handleInteraction = (value: string | number) => {
        const normalizedValue = normalizeVoteValue(value);
        if (hasVoted || phase !== 'input' || voteStatusRef.current === 'finalizing' || voteStatusRef.current === 'finalized') return;
        setDraftVote(normalizedValue);
        setLastInteractionTime(Date.now());

        // Optimistic local update so it's not lost on refresh even before auto-save
        localStorage.setItem(`vote_draft_${config.id}`, String(normalizedValue));
    };

    useEffect(() => {
        if (draftVote === null || hasVoted) return;

        const timer = setTimeout(() => {
            if (!hasVoted) {
                saveDraft(draftVote);
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
        saveDraft, // Expose for immediate triggers like onMouseUp
        handleInteraction // Expose this for continuous inputs
    };
}
