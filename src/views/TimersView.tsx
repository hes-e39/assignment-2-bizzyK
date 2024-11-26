// TimersView.tsx

import Button from '../components/button/Button';
import TimerComponent from '../components/timers/Timer';
import { useTimerContext } from '../context/TimerContext';

const TimersView = () => {
    const { state, dispatch } = useTimerContext();
    const { timers = [], activeTimerIndex } = state;

    const totalWorkoutTime = timers.reduce((total, timer) => {
        if (timer.type === 'xy') {
            return total + (timer.rounds || 1) * (timer.roundTime || 0);
        } else if (timer.type === 'tabata') {
            return total + (timer.rounds || 1) * ((timer.workTime || 0) + (timer.restTime || 0));
        } else {
            return total + timer.duration;
        }
    }, 0);

    const handleBeginWorkout = () => {
        if (timers.length > 0) {
            dispatch({ type: 'START_TIMER', payload: 0 });
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
    };

    const handleFastForwardWorkout = () => {
        if (activeTimerIndex !== null) {
            dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
        }
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
                    {timers.map((timer, index) => (
                        <div key={timer.id} className="timer-wrapper">
                            <TimerComponent {...timer} isActive={index === activeTimerIndex} />
                            <Button type="danger" label="Remove" onClick={() => dispatch({ type: 'REMOVE_TIMER', payload: timer.id })} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimersView;
