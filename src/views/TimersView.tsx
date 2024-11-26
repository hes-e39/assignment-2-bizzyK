// TimersView.tsx

import Button from '../components/button/Button';
import Timer from '../components/timers/Timer';
import { useTimerContext } from '../context/TimerContext';

const TimersView = () => {
    const {
        timers = [],
        activeTimerIndex,
        dispatch,
    } = useTimerContext(state => ({
        timers: state?.timers || [],
        activeTimerIndex: state?.activeTimerIndex,
    }));

    // Calculate total workout time safely
    const totalWorkoutTime = timers.reduce((total: number, timer: Timer) => {
        if (timer.type === 'xy') {
            return total + (timer.rounds || 1) * (timer.roundTime || 0);
        } else if (timer.type === 'tabata') {
            return total + (timer.rounds || 1) * ((timer.workTime || 0) + (timer.restTime || 0));
        } else {
            return total + (timer.duration || 0);
        }
    }, 0);

    const handleBeginWorkout = () => {
        if (timers.length > 0) {
            dispatch({ type: 'START_TIMER', payload: 0 }); // Start the first timer
        }
    };

    const handlePauseResumeWorkout = () => {
        if (activeTimerIndex !== null) {
            const isCurrentlyPaused = timers[activeTimerIndex]?.state === 'paused';
            dispatch({
                type: 'UPDATE_TIMER_STATE',
                payload: { index: activeTimerIndex, state: isCurrentlyPaused ? 'running' : 'paused' },
            });
        }
    };

    const handleResetWorkout = () => {
        dispatch({ type: 'RESET_TIMER_STATE' });
    };

    const handleFastForwardWorkout = () => {
        if (activeTimerIndex !== null) {
            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
        }
    };

    const handleRemoveTimer = (id: string) => {
        dispatch({ type: 'REMOVE_TIMER', payload: id });
    };

    return (
        <div>
            <div className="workout-header">
                <p>Total Workout Time: {totalWorkoutTime} seconds</p>
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
                    {timers
                        .slice()
                        .sort((a: Timer, b: Timer) => a.addedAt - b.addedAt)
                        .map((timer: Timer, index: number) => (
                            <div key={timer.id} className="timer-wrapper">
                                <Timer {...timer} isActive={index === activeTimerIndex} />
                                <div className="remove-button-container">
                                    <Button type="danger" label="Remove" onClick={() => handleRemoveTimer(timer.id)} />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default TimersView;
