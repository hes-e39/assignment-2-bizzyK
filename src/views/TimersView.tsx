// TimersView.tsx

import { useEffect, useState } from 'react';
import Button from '../components/button/Button';
import TimerComponent from '../components/timers/Timer';
import { useTimerContext } from '../context/TimerContext';

const TimersView = () => {
    const { state, dispatch } = useTimerContext();
    const { timers = [], activeTimerIndex } = state;
    const [remainingWorkoutTime, setRemainingWorkoutTime] = useState(0);
    const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

    // Calculate Total Workout Time
    const totalWorkoutTime = timers.reduce((total, timer) => {
        if (timer.type === 'xy') {
            return total + (timer.rounds || 1) * (timer.roundTime || 0);
        } else if (timer.type === 'tabata') {
            return total + (timer.rounds || 1) * ((timer.workTime || 0) + (timer.restTime || 0));
        } else {
            return total + timer.duration;
        }
    }, 0);

    // Update Remaining Workout Time
    useEffect(() => {
        const calculateRemainingWorkoutTime = () => {
            if (activeTimerIndex === null) return totalWorkoutTime;

            let remainingTime = 0;

            timers.forEach((timer, index) => {
                if (index === activeTimerIndex) {
                    const currentTime = timer.state === 'running' || timer.state === 'paused' ? timer.duration || 0 : 0;
                    if (timer.type === 'xy') {
                        const completedRounds = timer.currentRound || 1;
                        const remainingRounds = (timer.rounds || 1) - completedRounds;
                        remainingTime += (timer.roundTime || 0) * remainingRounds;
                        remainingTime += currentTime;
                    } else if (timer.type === 'tabata') {
                        const completedRounds = timer.currentRound || 1;
                        const remainingRounds = (timer.rounds || 1) - completedRounds;
                        remainingTime += ((timer.workTime || 0) + (timer.restTime || 0)) * remainingRounds;
                        remainingTime += currentTime;
                    } else {
                        remainingTime += currentTime;
                    }
                } else if (index > activeTimerIndex) {
                    if (timer.type === 'xy') {
                        remainingTime += (timer.rounds || 1) * (timer.roundTime || 0);
                    } else if (timer.type === 'tabata') {
                        remainingTime += (timer.rounds || 1) * ((timer.workTime || 0) + (timer.restTime || 0));
                    } else {
                        remainingTime += timer.duration || 0;
                    }
                }
            });

            return remainingTime;
        };

        setRemainingWorkoutTime(calculateRemainingWorkoutTime());

        // Check if workout is complete
        if (timers.length > 0 && activeTimerIndex === null && remainingWorkoutTime === 0) {
            setIsWorkoutComplete(true); // Workout is complete
        } else {
            setIsWorkoutComplete(false); // Reset the flag
        }

        const interval = setInterval(() => {
            if (activeTimerIndex !== null) {
                setRemainingWorkoutTime(calculateRemainingWorkoutTime());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timers, activeTimerIndex, totalWorkoutTime, remainingWorkoutTime]);

    // Control Handlers
    const handleBeginWorkout = () => {
        if (timers.length > 0) {
            dispatch({ type: 'START_TIMER', payload: 0 });
            setIsWorkoutComplete(false); // Ensure flag is reset when starting a workout
        }
    };

    const handlePauseResumeWorkout = () => {
        if (activeTimerIndex !== null) {
            const isPaused = timers[activeTimerIndex]?.state === 'paused';
            dispatch({
                type: 'UPDATE_TIMER_STATE',
                payload: { index: activeTimerIndex, state: isPaused ? 'running' : 'paused' },
            });
        }
    };

    const handleResetWorkout = () => {
        dispatch({ type: 'RESET_TIMER_STATE' });
        setRemainingWorkoutTime(totalWorkoutTime); // Reset Remaining Time
        setIsWorkoutComplete(false); // Ensure the congratulations message does not show
    };

    const handleFastForwardWorkout = () => {
        if (activeTimerIndex !== null) {
            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
        }
    };

    return (
        <div>
            {isWorkoutComplete ? (
                <div className="congrats-message">
                    🎉 Congratulations! Your workout is complete! 🎉
                </div>
            ) : (
                <>
                    <div className="workout-header">
                        <p>
                            Total Workout Time: {totalWorkoutTime} seconds | Remaining Workout Time: {remainingWorkoutTime} seconds
                        </p>
                        <div className="workout-controls">
                            <Button label="Begin Workout" onClick={handleBeginWorkout} disabled={timers.length === 0 || activeTimerIndex !== null} />
                            <Button
                                label={activeTimerIndex !== null && timers[activeTimerIndex]?.state === 'paused' ? 'Resume Workout' : 'Pause Workout'}
                                onClick={handlePauseResumeWorkout}
                                disabled={activeTimerIndex === null}
                            />
                            <Button label="Reset Workout" onClick={handleResetWorkout} disabled={timers.length === 0} />
                            <Button label="Fast Forward" onClick={handleFastForwardWorkout} disabled={activeTimerIndex === null} />
                        </div>
                    </div>
                    {timers.length === 0 ? (
                        <p className="center-text">No timers configured. Add a timer to get started.</p>
                    ) : (
                        <div className="timers-container">
                            {timers.map((timer, index) => (
                                <div key={timer.id} className="timer-wrapper">
                                    <TimerComponent
                                        {...timer}
                                        isActive={index === activeTimerIndex}
                                        state={timer.state}
                                    />
                                    <Button type="danger" label="Remove" onClick={() => dispatch({ type: 'REMOVE_TIMER', payload: timer.id })} />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TimersView;