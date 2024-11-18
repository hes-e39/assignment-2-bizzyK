// TimerContext.tsx
import React, { createContext, useReducer, useContext } from "react";
import { TimerType } from "../views/AddTimer";

// Define the timer states and types
type Timer = {
    id: string;
    type: TimerType;
    duration: number;
    name: string;
    state: "not running" | "running" | "completed";
};

type TimerState = {
    timers: Timer[]; // Queue of timers
    activeTimerIndex: number | null; // Index of the currently active timer
};

type TimerAction =
    | { type: "ADD_TIMER"; payload: Timer }
    | { type: "REMOVE_TIMER"; payload: string } // Remove by ID
    | { type: "RESET_TIMERS" }
    | { type: "START_TIMER"; payload: number } // Start a timer by index
    | { type: "COMPLETE_TIMER"; payload: number } // Mark timer as completed
    | { type: "RESET_TIMER_STATE" }; // Reset all timer states

const initialState: TimerState = {
    timers: [],
    activeTimerIndex: null,
};

// Reducer function
function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case "ADD_TIMER":
            return { ...state, timers: [...state.timers, action.payload] };
        case "REMOVE_TIMER":
            return {
                ...state,
                timers: state.timers.filter((timer) => timer.id !== action.payload),
            };
        case "RESET_TIMERS":
            return initialState;
        case "START_TIMER":
            return { ...state, activeTimerIndex: action.payload };
        case "COMPLETE_TIMER":
            return {
                ...state,
                timers: state.timers.map((timer, index) =>
                    index === action.payload ? { ...timer, state: "completed" } : timer
                ),
                activeTimerIndex: null,
            };
        case "RESET_TIMER_STATE":
            return {
                ...state,
                timers: state.timers.map((timer) => ({ ...timer, state: "not running" })),
                activeTimerIndex: null,
            };
        default:
            return state;
    }
}

// Create the context
const TimerContext = createContext<{
    state: TimerState;
    dispatch: React.Dispatch<TimerAction>;
} | null>(null);

// Context Provider
export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);

    return (
        <TimerContext.Provider value={{ state, dispatch }}>
            {children}
        </TimerContext.Provider>
    );
};

// Hook to use the TimerContext
export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error("useTimerContext must be used within a TimerProvider");
    }
    return context;
};
