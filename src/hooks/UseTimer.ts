// UseTimer.ts

import { useCallback, useEffect, useState } from 'react';
import { useTimerContext } from '../context/TimerContext';

interface UseTimerParams {
    type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
    startTime?: number;
    workTime?: number;
    restTime?: number;
    roundTime?: number;
    rounds?: number;
    duration?: number;
}

interface UseTimerReturn {
    time: number;
    isActive: boolean;
    isPaused: boolean;
    isWorkInterval: boolean;
    currentRound: number;
    start: () => void;
    pause: () => void;
    reset: () => void;
    fastForward: () => void;
}

const useTimer = ({ type, workTime = 20, restTime = 10, roundTime = 60, rounds = 1, duration = 10 }: UseTimerParams): UseTimerReturn => {
    const [time, setTime] = useState(type === 'countdown' ? duration : 0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isWorkInterval, setIsWorkInterval] = useState(true);
    const [currentRound, setCurrentRound] = useState(1);

    const { state, dispatch } = useTimerContext();
    const { activeTimerIndex } = state;

    const handleEndOfInterval = useCallback(() => {
        if (activeTimerIndex === null) return;

        if (type === 'xy') {
            if (currentRound < rounds) {
                setCurrentRound(prev => prev + 1);
                setTime(roundTime); // Reset time for the next round
            } else {
                setIsActive(false);
                dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
            }
        } else if (type === 'tabata') {
            if (currentRound === rounds && !isWorkInterval) {
                setIsActive(false);
                dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
            } else if (isWorkInterval) {
                setIsWorkInterval(false); // Switch to rest interval
                setTime(restTime);
            } else {
                setIsWorkInterval(true); // Switch to work interval
                setCurrentRound(prev => (prev < rounds ? prev + 1 : prev));
                setTime(workTime);
            }
        } else if (type === 'countdown') {
            setIsActive(false);
            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
        }
    }, [type, currentRound, rounds, roundTime, restTime, workTime, isWorkInterval, dispatch, activeTimerIndex]);

    useEffect(() => {
        if (!isActive || isPaused) return;

        const timer = setInterval(() => {
            setTime(prevTime => {
                if (type === 'stopwatch') {
                    if (prevTime + 1 >= duration) {
                        clearInterval(timer);
                        setIsActive(false);
                        if (activeTimerIndex !== null) {
                            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                        }
                        return duration; // Stop the stopwatch at the specified duration
                    }
                    return prevTime + 1; // Increment stopwatch time
                }

                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleEndOfInterval();
                    return 0; // Prevent negative time
                }

                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, isPaused, handleEndOfInterval, duration, type, activeTimerIndex, dispatch]);

    return {
        time,
        isActive,
        isPaused,
        isWorkInterval,
        currentRound,
        start: useCallback(() => {
            setIsActive(true);
            setIsPaused(false);

            if (type === 'xy') {
                setTime(roundTime); // Initialize with roundTime for XY
            } else if (type === 'tabata') {
                setTime(workTime); // Initialize with workTime for Tabata
            } else if (type === 'countdown') {
                setTime(duration); // Initialize with duration for Countdown
            }

            if (activeTimerIndex !== null) {
                dispatch({ type: 'UPDATE_TIMER_STATE', payload: { index: activeTimerIndex, state: 'running' } });
            }
        }, [type, roundTime, workTime, duration, activeTimerIndex, dispatch]),
        pause: useCallback(() => {
            setIsPaused(prev => !prev);
            if (activeTimerIndex !== null) {
                dispatch({
                    type: 'UPDATE_TIMER_STATE',
                    payload: { index: activeTimerIndex, state: isPaused ? 'running' : 'paused' },
                });
            }
        }, [dispatch, activeTimerIndex, isPaused]),
        reset: useCallback(() => {
            setIsActive(false);
            setIsPaused(false);
            setCurrentRound(1);
            setIsWorkInterval(true);
            setTime(type === 'countdown' ? duration : 0); // Reset to duration for countdown, 0 otherwise

            if (dispatch) {
                dispatch({ type: 'RESET_TIMER_STATE' });
            }
        }, [dispatch, type, duration]),
        fastForward: useCallback(() => {
            if (activeTimerIndex !== null) {
                if (type === 'xy') {
                    // Complete all remaining rounds
                    setCurrentRound(rounds); // Set to last round
                    setTime(0); // Set time to 0 for the last round
                } else if (type === 'tabata') {
                    // Complete all remaining intervals
                    setCurrentRound(rounds); // Set to last round
                    setIsWorkInterval(false); // Set to last rest interval
                    setTime(0); // Set time to 0 for the last interval
                } else {
                    // For stopwatch and countdown, just set time to 0
                    setTime(0);
                }

                setIsActive(false); // Stop the current timer
                dispatch({ type: 'UPDATE_TIMER_STATE', payload: { index: activeTimerIndex, state: 'completed' } }); // Mark as completed
                setTimeout(() => {
                    dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex }); // Transition to next timer
                }, 0);
            }
        }, [type, rounds, dispatch, activeTimerIndex]),
    };
};

export default useTimer;