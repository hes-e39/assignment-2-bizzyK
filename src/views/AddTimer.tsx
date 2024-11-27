// AddTimer.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import icons
import Button from '../components/button/Button';
import { useTimerContext } from '../context/TimerContext';

export type TimerType = 'stopwatch' | 'countdown' | 'xy' | 'tabata';

const AddTimer = () => {
    const [timerType, setTimerType] = useState<TimerType>('stopwatch');
    const [duration, setDuration] = useState(10); // Default duration
    const [roundTime, setRoundTime] = useState(60); // For XY
    const [workTime, setWorkTime] = useState(20); // For Tabata
    const [restTime, setRestTime] = useState(10); // For Tabata
    const [rounds, setRounds] = useState(1); // For XY and Tabata
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { state, dispatch } = useTimerContext();
    const navigate = useNavigate();

    const handleAddTimer = () => {
        if (timerType === 'stopwatch' || timerType === 'countdown') {
            if (duration <= 0) {
                setError('Duration must be greater than 0.');
                return;
            }
        } else if (timerType === 'xy') {
            if (roundTime <= 0 || rounds <= 0) {
                setError('Round time and number of rounds must be greater than 0.');
                return;
            }
        } else if (timerType === 'tabata') {
            if (workTime <= 0 || restTime <= 0 || rounds <= 0) {
                setError('Work time, rest time, and number of rounds must be greater than 0.');
                return;
            }
        }
        setError(''); // Clear any existing errors

        // Generate a default name if no name is provided
        const nextNumber = state.timers.length + 1;
        const defaultName = `Timer ${nextNumber}`;

        const newTimer = {
            id: uuidv4(),
            type: timerType,
            duration,
            roundTime,
            workTime,
            restTime,
            rounds,
            name: name.trim() || defaultName,
            state: 'not running' as const,
            addedAt: Date.now(),
            currentRound: 1,
        };

        dispatch({ type: 'ADD_TIMER', payload: newTimer });
        dispatch({ type: 'RESET_TIMER_STATE' });
        navigate('/'); // Navigate back to the home page
    };

    const handleTimerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value as TimerType;
        setTimerType(selectedType);

        // Set default values for specific timer types
        if (selectedType === 'xy') {
            setDuration(0);
            setRoundTime(60);
            setRounds(3);
        } else if (selectedType === 'tabata') {
            setDuration(0);
            setWorkTime(20);
            setRestTime(10);
            setRounds(8);
        } else {
            setDuration(10);
            setRoundTime(0);
            setWorkTime(0);
            setRestTime(0);
            setRounds(0);
        }
    };

    return (
        <div className="timers-container">
            <div className="add-timer-page">
                <div className="timer-wrapper">
                    <h2>Add Timer</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTimer();
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="timerType">Timer Type:</label>
                            <select
                                id="timerType"
                                value={timerType}
                                onChange={handleTimerTypeChange}
                                className="input"
                            >
                                <option value="stopwatch">Stopwatch</option>
                                <option value="countdown">Countdown</option>
                                <option value="xy">XY</option>
                                <option value="tabata">Tabata</option>
                            </select>
                        </div>
                        {timerType === 'stopwatch' && (
                            <div className="form-group">
                                <label htmlFor="duration">Duration (seconds):</label>
                                <input
                                    id="duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="input"
                                    min="1"
                                />
                            </div>
                        )}
                        {timerType === 'countdown' && (
                            <div className="form-group">
                                <label htmlFor="duration">Duration (seconds):</label>
                                <input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="input"
                                    min="1"
                                />
                            </div>
                        )}
                        {timerType === 'xy' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="roundTime">Round Time (seconds):</label>
                                    <input
                                        id="roundTime"
                                        type="number"
                                        value={roundTime}
                                        onChange={(e) => setRoundTime(Number(e.target.value))}
                                        className="input"
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rounds">Number of Rounds:</label>
                                    <input
                                        id="rounds"
                                        type="number"
                                        value={rounds}
                                        onChange={(e) => setRounds(Number(e.target.value))}
                                        className="input"
                                        min="1"
                                    />
                                </div>
                            </>
                        )}
                        {timerType === 'tabata' && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="workTime">Work Time (seconds):</label>
                                    <input
                                        id="workTime"
                                        type="number"
                                        value={workTime}
                                        onChange={(e) => setWorkTime(Number(e.target.value))}
                                        className="input"
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="restTime">Rest Time (seconds):</label>
                                    <input
                                        id="restTime"
                                        type="number"
                                        value={restTime}
                                        onChange={(e) => setRestTime(Number(e.target.value))}
                                        className="input"
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="rounds">Number of Rounds:</label>
                                    <input
                                        id="rounds"
                                        type="number"
                                        value={rounds}
                                        onChange={(e) => setRounds(Number(e.target.value))}
                                        className="input"
                                        min="1"
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label htmlFor="name">Name (optional):</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                placeholder="e.g., Warm-Up"
                            />
                        </div>
                        <div className="form-buttons">
                            <Button htmlType="submit" label="Add Timer" icon={faPlus}/>
                            <Button
                                type="secondary"
                                label="Cancel"
                                icon={faTimes}
                                onClick={() => navigate('/')}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTimer;