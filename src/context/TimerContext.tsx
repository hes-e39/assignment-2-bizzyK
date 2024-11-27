//TimerContext.tsx

import React, { createContext, useReducer, useContext } from 'react';
import type { TimerType } from '../views/AddTimer';

export type Timer = {
    id: string;
    type: TimerType;
    duration: number;
    name: string;
    state: 'not running' | 'running' | 'completed' | 'paused';
    addedAt: number;
    rounds?: number;
    roundTime?: number;
    workTime?: number;
    restTime?: number;
    currentRound?: number;
};

type TimerState = {
    timers: Timer[];
    activeTimerIndex: number | null;
    queueMode: 'sequential';
};

type TimerAction =
    | { type: 'ADD_TIMER'; payload: Timer }
    | { type: 'REMOVE_TIMER'; payload: string }
    | { type: 'RESET_TIMERS' }
    | { type: 'START_TIMER'; payload: number }
    | { type: 'COMPLETE_TIMER'; payload: number }
    | { type: 'RESET_TIMER_STATE' }
    | { type: 'UPDATE_TIMER_STATE'; payload: { index: number; state: 'running' | 'paused' | 'completed'; currentRound?: number } };

const initialState: TimerState = {
    timers: [],
    activeTimerIndex: null,
    queueMode: 'sequential',
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type) {
        case 'ADD_TIMER':
            return { ...state, timers: [...state.timers, action.payload] };

        case 'REMOVE_TIMER': {
            const updatedTimers = state.timers.filter(timer => timer.id !== action.payload);
            return {
                ...state,
                timers: updatedTimers,
                activeTimerIndex: updatedTimers.length === 0 ? null : state.activeTimerIndex,
            };
        }

        case 'RESET_TIMERS':
            return initialState;

        case 'START_TIMER':
            return { ...state, activeTimerIndex: action.payload };

        case 'COMPLETE_TIMER': {
            const nextIndex =
                state.activeTimerIndex !== null &&
                state.activeTimerIndex + 1 < state.timers.length
                    ? state.activeTimerIndex + 1
                    : null;

            return {
                ...state,
                timers: state.timers.map((timer, index) =>
                    index === state.activeTimerIndex
                        ? {
                            ...timer,
                            state: 'completed',
                            duration: 0,
                            currentRound: timer.rounds || 1, // Mark all rounds completed
                        }
                        : timer
                ),
                activeTimerIndex: nextIndex, // Move to the next timer or null if workout ends
            };
        }

        case 'RESET_TIMER_STATE':
            return {
                ...state,
                timers: state.timers.map(timer => {
                    let resetTime = 0;

                    if (timer.type === 'xy') {
                        resetTime = timer.roundTime || 0; // Reset to the first round's time
                    } else if (timer.type === 'tabata') {
                        resetTime = timer.workTime || 0; // Reset to the first work interval
                    } else if (timer.type === 'countdown') {
                        resetTime = timer.duration || 0; // Reset to the original countdown duration
                    }

                    return {
                        ...timer,
                        state: 'not running', // Reset timer state
                        currentRound: timer.type === 'xy' || timer.type === 'tabata' ? 1 : undefined, // Reset rounds for applicable timers
                        duration: timer.type === 'stopwatch' || timer.type === 'countdown' ? resetTime : timer.duration, // Reset only for stopwatch and countdown
                    };
                }),
                activeTimerIndex: null, // Reset active timer index
            };

        case 'UPDATE_TIMER_STATE': {
            const { index, state: newState } = action.payload;
            return {
                ...state,
                timers: state.timers.map((timer, i) => (i === index ? { ...timer, state: newState } : timer)),
            };
        }

        default:
            throw new Error(`Unhandled action type: ${(action as TimerAction).type}`);
    }
};

const TimerContext = createContext<{ state: TimerState; dispatch: React.Dispatch<TimerAction> } | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);
    return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};

export const useTimerContext = (): { state: TimerState; dispatch: React.Dispatch<TimerAction> } => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};