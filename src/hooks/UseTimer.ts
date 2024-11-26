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

const useTimer = ({ type, startTime = 0, workTime = 20, restTime = 10, roundTime = 60, rounds = 1, duration = 10 }: UseTimerParams): UseTimerReturn => {
    const [time, setTime] = useState(type === 'countdown' ? startTime : 0);
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
                setTime(roundTime);
            } else {
                setIsActive(false);
                setTimeout(() => {
                    dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                }, 0); // Defer state update
            }
        } else if (type === 'tabata') {
            if (currentRound === rounds && !isWorkInterval) {
                setIsActive(false);
                setTimeout(() => {
                    dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                }, 0); // Defer state update
            } else if (isWorkInterval) {
                setIsWorkInterval(false);
                setTime(restTime);
            } else {
                setIsWorkInterval(true);
                setCurrentRound(prev => (prev < rounds ? prev + 1 : prev));
                setTime(workTime);
            }
        } else {
            setIsActive(false);
            setTimeout(() => {
                dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
            }, 0); // Defer state update
        }
    }, [type, currentRound, rounds, roundTime, restTime, workTime, isWorkInterval, dispatch, activeTimerIndex]);

    useEffect(() => {
        if (!isActive || isPaused) return;

        const timer = setInterval(() => {
            setTime(prevTime => {
                if (type === 'stopwatch' && prevTime + 1 >= duration) {
                    clearInterval(timer);
                    setIsActive(false);
                    if (activeTimerIndex !== null) {
                        setTimeout(() => {
                            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                        }, 0); // Defer state update
                    }
                    return duration;
                }
                if (prevTime - 1 <= 0 && type !== 'stopwatch') {
                    clearInterval(timer);
                    setTimeout(handleEndOfInterval, 0); // Defer interval handling
                    return 0;
                }
                return type === 'stopwatch' ? prevTime + 1 : prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, isPaused, type, duration, handleEndOfInterval, dispatch, activeTimerIndex]);

    return {
        time,
        isActive,
        isPaused,
        isWorkInterval,
        currentRound,
        start: useCallback(() => {
            setIsActive(true);
            setIsPaused(false);
            if (dispatch && activeTimerIndex !== null) {
                setTimeout(() => {
                    dispatch({
                        type: 'UPDATE_TIMER_STATE',
                        payload: { index: activeTimerIndex, state: 'running' },
                    });
                }, 0); // Defer dispatch
            }
        }, [dispatch, activeTimerIndex]),
        pause: useCallback(() => {
            setIsPaused(prev => !prev);
            if (dispatch && activeTimerIndex !== null) {
                const newState = isPaused ? 'running' : 'paused';
                setTimeout(() => {
                    dispatch({
                        type: 'UPDATE_TIMER_STATE',
                        payload: { index: activeTimerIndex, state: newState },
                    });
                }, 0); // Defer dispatch
            }
        }, [dispatch, activeTimerIndex, isPaused]),
        reset: useCallback(() => {
            setIsActive(false);
            setIsPaused(false);
            setCurrentRound(1);
            setIsWorkInterval(true);
            setTime(type === 'countdown' ? startTime : 0);
            if (dispatch) {
                setTimeout(() => {
                    dispatch({ type: 'RESET_TIMER_STATE' });
                }, 0); // Defer dispatch
            }
        }, [dispatch, type, startTime]),
        fastForward: useCallback(() => {
            setTime(0);
            setIsActive(false);
            if (dispatch && activeTimerIndex !== null) {
                setTimeout(() => {
                    dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                }, 0); // Defer dispatch
            }
        }, [dispatch, activeTimerIndex]),
    };
};

export default useTimer;
