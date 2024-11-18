// AddTimer.tsx
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/button/Button';
import { useTimerContext } from '../context/TimerContext';

export type TimerType = 'stopwatch' | 'countdown' | 'xy' | 'tabata';

const AddTimer = () => {
    const [timerType, setTimerType] = useState<TimerType>('stopwatch');
    const [duration, setDuration] = useState(10); // Default duration
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = useTimerContext();
    const navigate = useNavigate();

    const handleAddTimer = () => {
        if (duration <= 0) {
            setError('Duration must be greater than 0.');
            return;
        }

        setError(''); // Clear any existing errors

        dispatch({
            type: 'ADD_TIMER',
            payload: {
                id: uuidv4(),
                type: timerType,
                duration,
                name: name || timerType,
                state: 'not running',
            },
        });

        navigate('/'); // Navigate back to the home page
    };

    const handleTimerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value as TimerType;
        setTimerType(selectedType);
        if (selectedType === 'tabata') setDuration(20);
        else if (selectedType === 'xy') setDuration(60);
        else setDuration(10);
    };

    return (
        <div className="timer-container">
            <h2>Add Timer</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleAddTimer();
                }}
                style={{ width: '100%' }}
            >
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="timerType">Timer Type:</label>
                    <select id="timerType" value={timerType} onChange={handleTimerTypeChange} className="input">
                        <option value="stopwatch">Stopwatch</option>
                        <option value="countdown">Countdown</option>
                        <option value="xy">XY</option>
                        <option value="tabata">Tabata</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration (seconds):</label>
                    <input id="duration" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="input" min="1" required />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name (optional):</label>
                    <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g., Warm-Up" />
                </div>
                <div className="controls">
                    <Button onClick={handleAddTimer} label="Add Timer" />
                    <Button onClick={() => navigate('/')} label="Cancel" />
                </div>
            </form>
        </div>
    );
};

export default AddTimer;
